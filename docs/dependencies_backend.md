# INICIALIZAMOS EL NODE.JS EN EL BACKEND

npm init -y

# Esto creará package.json. Luego instala las dependencias:

npm install express cors helmet morgan dotenv jsonwebtoken bcryptjs
npm install @prisma/client
npm install typescript @types/node @types/express @types/cors @types/morgan @types/jsonwebtoken @types/bcryptjs ts-node nodemon --save-dev

# Crea el archivo tsconfig.json en la raíz de backend/.

npx tsc --init

# Instalar Prisma como dependencia de desarrollo

npm install prisma --save-dev

# Generamos el npx prisma

npx prisma generate

# Hacemos la migración

npx prisma migrate dev --name init

# Permitir conectar a PostgreSQL en seed y dev

npm install @prisma/adapter-pg pg
