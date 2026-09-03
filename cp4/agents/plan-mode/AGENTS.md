# FastAPI Project

## Stack

- Python 3.14.3, FastAPI 0.139.0, Uvicorn 0.51.0

## Virtual environment

- Located at venv/ (already created)
- Activate: venv\Scripts\activate (Windows)
- Dependencies are installed via pip (no requirements.txt — use pip freeze > requirements.txt to create one)

## Running

uvicorn main:app --reload

# or

fastapi dev main.py

## Entrypoint

- main.py — single FastAPI app instance (app)
