import { execFile } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { appendFile, rm } from "node:fs/promises"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const __dirname = dirname(fileURLToPath(import.meta.url))

const CHECK_SCRIPT = resolve(__dirname, "check_health.py")
const AUDIT_LOG = resolve(__dirname, "harness_audit.log")

const FILE_TOOLS = new Set(["edit", "write", "multi_edit"])
const PYTHON_BINS = ["python", "py"]

function collectTargets(input) {
  const args = input?.args ?? {}
  if (input?.tool === "multi_edit" && Array.isArray(args.edits)) {
    return args.edits
      .map((edit) => edit?.filePath)
      .filter((f) => typeof f === "string" && f.endsWith(".py"))
  }
  if (typeof args.filePath === "string" && args.filePath.endsWith(".py")) {
    return [args.filePath]
  }
  return []
}

async function runPython(args) {
  for (const bin of PYTHON_BINS) {
    try {
      const { stdout, stderr } = await execFileAsync(bin, args)
      return { exitCode: 0, stdout, stderr }
    } catch (err) {
      if (err.code === "ENOENT") continue
      return { exitCode: err.code ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? "" }
    }
  }
  throw new Error("No se encontro un interprete de Python (python o py) en el PATH.")
}

async function runGit(args) {
  try {
    const { stdout, stderr } = await execFileAsync("git", args)
    return { exitCode: 0, stdout, stderr }
  } catch (err) {
    return { exitCode: err.code ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? "" }
  }
}

async function isTracked(file) {
  const res = await runGit(["ls-files", "--error-unmatch", "--", file])
  return res.exitCode === 0
}

async function rollback(file) {
  if (await isTracked(file)) {
    const res = await runGit(["restore", "--", file])
    return { method: "git restore", ok: res.exitCode === 0, detail: res.stderr || res.stdout }
  }
  await rm(file, { force: true })
  return { method: "eliminado (sin seguimiento en git)", ok: true, detail: "" }
}

async function auditRollback(file, method, ok, detail) {
  const ts = new Date().toISOString()
  const line =
    `[${ts}] FILE=${file} ROLLBACK=${ok ? "OK" : "FAILED"} METHOD=${method}` +
    (detail ? ` DETAIL=${detail}` : "") +
    "\n"
  await appendFile(AUDIT_LOG, line, "utf-8").catch(() => {})
}

export const HarnessPythonAstCheck = async () => {
  return {
    "tool.execute.after": async (input) => {
      const targets = collectTargets(input)
      if (targets.length === 0) return

      const failures = []
      for (const file of targets) {
        const res = await runPython([CHECK_SCRIPT, file])
        if (res.exitCode === 0) continue

        const rb = await rollback(file)
        await auditRollback(file, rb.method, rb.ok, rb.detail)
        failures.push({ file, res, rb })
      }

      if (failures.length === 0) return

      const parts = failures.map(({ file, res, rb }) => {
        const detail = (res.stderr || res.stdout || "").trim().split("\n").slice(-1)[0] || "error de sintaxis"
        return (
          `- ${file}: ${detail}\n` +
          `  Rollback: ${rb.method} -> ${rb.ok ? "OK (archivo restaurado)" : "FALLO: " + rb.detail}`
        )
      })

      throw new Error(
        "[HARNESS] Error de sintaxis en archivo(s) Python tras la edicion. " +
          "Se revirtio(n) solo el(los) archivo(s) afectado(s) a su estado previo.\n" +
          parts.join("\n"),
      )
    },
  }
}
