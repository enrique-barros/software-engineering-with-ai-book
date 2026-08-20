import { access, readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { HarnessPythonAstCheck } from "./harness-python-ast.js"

const here = dirname(fileURLToPath(import.meta.url))
const target = resolve(here, "../../calculator.py")
const auditLog = resolve(here, "harness_audit.log")

const original = await readFile(target, "utf-8")
let failures = 0

const check = (cond, msg) => {
  if (cond) console.log(`  PASS: ${msg}`)
  else {
    failures++
    console.error(`  FAIL: ${msg}`)
  }
}

const hooks = await HarnessPythonAstCheck({})
const after = hooks["tool.execute.after"]
const exists = (p) => access(p).then(() => true).catch(() => false)

console.log("Test: un archivo .py valido no debe lanzar el harness")
await writeFile(target, "def foo():\n    return 1\n", "utf-8")
await after({ tool: "edit", args: { filePath: target } })
check(true, "sin excepcion en archivo valido")

console.log("Test: un archivo .py con error debe lanzar el harness y revertirse con git restore")
await writeFile(target, "def foo(:\n", "utf-8")
let threw = false
try {
  await after({ tool: "edit", args: { filePath: target } })
} catch {
  threw = true
}
check(threw, "se lanzo la excepcion del harness")
const restored = await readFile(target, "utf-8")
check(restored === original, "el archivo quedo restaurado a su estado previo (git restore)")

console.log("Test: el log contiene el fallo y el rollback")
const log = await readFile(auditLog, "utf-8")
check(log.includes("RESULT=FAILED"), "el log contiene RESULT=FAILED")
check(log.includes("ROLLBACK=OK") && log.includes("git restore"), "el log contiene ROLLBACK=OK con metodo git restore")

console.log("Test: un archivo que no es .py no debe lanzar el harness")
await after({ tool: "edit", args: { filePath: resolve(here, "opencode.json") } })
check(true, "sin excepcion para archivo no .py")

console.log("Test: un .py nuevo (sin seguimiento en git) con error debe eliminarse")
const newFile = resolve(here, "../../untracked_probe.py")
await writeFile(newFile, "x = (\n", "utf-8")
threw = false
try {
  await after({ tool: "write", args: { filePath: newFile } })
} catch {
  threw = true
}
check(threw, "se lanzo la excepcion para el archivo nuevo con error")
check(!(await exists(newFile)), "el archivo nuevo sin seguimiento fue eliminado")

console.log("Test: multi_edit con archivos .py tambien se analiza")
await writeFile(target, "def bar(:\n", "utf-8")
threw = false
try {
  await after({
    tool: "multi_edit",
    args: { edits: [{ filePath: target }, { filePath: resolve(here, "opencode.json") }] },
  })
} catch {
  threw = true
}
check(threw, "se lanzo la excepcion para multi_edit con .py con error")
check((await readFile(target, "utf-8")) === original, "el archivo del multi_edit se restauro")

await writeFile(target, original, "utf-8")

if (failures > 0) {
  console.error(`\n${failures} prueba(s) fallaron`)
  process.exit(1)
}
console.log("\nTODAS LAS PRUEBAS PASARON")