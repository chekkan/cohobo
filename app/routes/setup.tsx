import { PrismaClient } from "@prisma/client";
import { data, redirect, useFetcher } from "react-router"
import type { ActionFunctionArgs } from "react-router";

export default function Setup() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors;
  return <div>
    <fetcher.Form method="post">
      <label htmlFor="email">Email</label>
      <input name="email" id="email" />
      {errors?.email ? <em role='alert'>{errors.email}</em> : null}
      <label htmlFor="password">Password</label>
      <input name="password" id="password" />
      <label htmlFor="confirm_password">Confirm Password</label>
      <input name="confirm_password" id="confirm_password" />
      <button type="submit">Submit</button>
    </fetcher.Form>
  </div>
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  const errors = {} as { email?: string };
  if (email && !email.includes("@")) {
    errors.email = "Not a valid email.";
  }
  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 200 });
  }
  const prisma = new PrismaClient();
  await prisma.user.create({ data: { email: 'Alice', password: 'voodo' } })
  return redirect('/');
}
