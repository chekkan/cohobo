import { PrismaClient } from "@prisma/client";
import { data, redirect, useFetcher } from "react-router"
import type { ActionFunctionArgs } from "react-router";

export async function loader() {
  const prisma = new PrismaClient();
  const allUsers = await prisma.user.findMany({ take: 1 });
  if (allUsers.length > 0) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }
  return null;
}

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
      {errors?.password ? <em role='alert'>{errors.password}</em> : null}
      <label htmlFor="confirm_password">Confirm Password</label>
      <input name="confirm_password" id="confirm_password" />
      <button type="submit">Submit</button>
    </fetcher.Form>
  </div>
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  const errors = {} as { email?: string, password?: string };
  if (!email) {
    errors.email = "Email is required.";
  }
  else if (!email.includes("@")) {
    errors.email = "Not a valid email.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }
  else if (password != confirmPassword) {
    errors.password = "Passwords don't match.";
  }
  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 200 });
  }
  const prisma = new PrismaClient();
  await prisma.user.create({ data: { email: 'Alice', password: 'voodo' } })
  return redirect('/');
}
