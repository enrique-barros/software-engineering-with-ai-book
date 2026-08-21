#!/usr/bin/env python3
"""Verificador sintactico (AST) para archivos Python del harness.

Uso:
    python check_health.py <archivo.py>

Codigos de salida:
    0  el archivo es sintacticamente valido
    1  hay errores de sintaxis o no se pudo leer el archivo
    2  uso incorrecto del script
"""

import ast
import sys
from datetime import datetime, timezone
from pathlib import Path

AUDIT_LOG = Path(__file__).resolve().parent / "harness_audit.log"


def log_failure(filepath: str, message: str) -> None:
    timestamp = datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
    entry = (
        f"[{timestamp}] FILE={filepath} RESULT=FAILED\n"
        f"ERROR: {message}\n"
        f"{'-' * 60}\n"
    )

    AUDIT_LOG.parent.mkdir(parents=True, exist_ok=True)
    with AUDIT_LOG.open("a", encoding="utf-8") as fh:
        fh.write(entry)


def main() -> int:
    if len(sys.argv) != 2:
        print(f"Uso: python {Path(__file__).name} <archivo.py>")
        return 2

    target = sys.argv[1]
    try:
        source = Path(target).read_text(encoding="utf-8-sig")
        ast.parse(source, filename=target)
    except (SyntaxError, IndentationError) as exc:
        log_failure(target, f"{type(exc).__name__}: {exc}")
        print(f"[AST CHECK: FAILED] {target}")
        print(f"{type(exc).__name__}: {exc}")
        return 1
    except OSError as exc:
        log_failure(target, f"OSError: {exc}")
        print(f"[AST CHECK: FAILED] {target}")
        print(f"OSError: {exc}")
        return 1

    print(f"[AST CHECK: PASSED] {target}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
