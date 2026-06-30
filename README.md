```bash
npx nest g resource country


for /f "delims=" %f in ('dir /s /b ^| findstr /v /i "\\api\\ \\coverage\\ \\dist\\ \node_modules\\  \\public\\ \\venv\\  \\__pycache__\\    \\.git\\ \\alembic\\  \\.next\\ \\.gitignore  README.md CLAUDE.md AGENTS.md package-lock.json"') do @echo Processing: %f & (echo ===== %f ===== & type "%f" & echo.)>>"../trash/all_code.txt"

```