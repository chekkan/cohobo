import { execaCommand } from "execa";

process.env.DATABASE_URL = "file:./cohobo_test.db";

export default async function setup() {
  await execaCommand(
    'npx prisma migrate reset --force --skip-seed --skip-generate',
    {
      stdio: 'inherit',
      env: process.env,
    },
  )

}
