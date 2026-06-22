import prisma from "../client";
import { EncryptionService } from "../../auth/EncryptionService";

const encryptionService = new EncryptionService();

async function main() {
  // Crear usuario admin
  const hashedPassword = await encryptionService.hash("admin123");
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("Seed completed: admin user created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
