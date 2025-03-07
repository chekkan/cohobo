import { PrismaClient } from "@prisma/client";
import { beforeEach } from "vitest";
import { execaCommand } from "execa";

beforeEach(async function () {
  await resetDatabase();
})

async function resetDatabase() {
  const prisma = new PrismaClient();
  // // Disables foreign key constraints to allow truncation
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);
  //
  // // Get all table names
  const tables = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
  );
  //
  // // Truncate all tables
  for (const { name } of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`);
  }
  //
  // // Re-enable foreign key constraints
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
}
