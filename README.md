```bash
npx nest g resource country
npm install prisma --save-dev
npm install @prisma/client

npm uninstall prisma @prisma/client
npm install prisma@6 @prisma/client@6



npx prisma init
npx prisma db pull
npx prisma generate
npx prisma db push

npx nest g resource brand


for /f "delims=" %f in ('dir /s /b ^| findstr /v /i "\\api\\ \\coverage\\ \\dist\\ \node_modules\\  \\public\\ \\venv\\  \\__pycache__\\    \\.git\\ \\alembic\\  \\.next\\ \\.gitignore  README.md CLAUDE.md AGENTS.md package-lock.json"') do @echo Processing: %f & (echo ===== %f ===== & type "%f" & echo.)>>"../../trash/all_code.txt"

```
npm install @nestjs/passport passport passport-local
npm install @nestjs/jwt passport-jwt
npm install bcrypt
npm install -D @types/passport-local @types/passport-jwt @types/bcrypt

npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt



# Env DB Connection
# replicaSet=rs0 is mandatory for Prisma ORM

# Add below code in Fly-Env Config
# replication:
#  replSetName: rs0
# DATABASE_URL="mongodb://127.0.0.1:27017/ecommerce?replicaSet=rs0"



MongoDBStep01:
cd "C:\Program Files\FlyEnv-Data\app\mongodb-8.2.7\bin"
mongod --dbpath C:\data\db

MongoDBStep02:
cd "C:\Users\prase\Downloads\mongosh-2.9.1-win32-x64\bin"
mongosh --version
mongosh
rs.status()
rs.initiate()
rs.status()
