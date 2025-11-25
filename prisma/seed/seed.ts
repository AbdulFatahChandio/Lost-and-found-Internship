
import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./role.seed";


const prisma = new PrismaClient();

async function main() {

  await seedRoles();

  console.log("All seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });