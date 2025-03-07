import { PrismaClient } from "@prisma/client";
import { redirect, useFetcher } from "react-router"

export default function Setup() {
  let fetcher = useFetcher();
  return <div>
    <fetcher.Form method="post">
      <input name="email" />
      <input name="password" />
      <input name="confirm_password" />
      <button type="submit">Submit</button>
    </fetcher.Form>
  </div>
}

export async function action(): Promise<Response> {
  const prisma = new PrismaClient();
  await prisma.user.create({ data: { email: 'Alice', password: 'voodo' } })
  return redirect('/');
}
