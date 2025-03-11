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
    <h1 className="text-xl font-bold text-center my-8">Setup</h1>
    <fetcher.Form method="post" className="md:w-1/2 mx-4 md:mx-auto border rounded border-black/10 my-4 p-3 bg-yellow-50/50">
      <div className="mb-2">
        <label htmlFor="email">Email</label>
        <input name="email" id="email" className="w-full border border-black/50 bg-white" />
        {errors?.email ? <em role='alert' className="text-red-400 text-sm">{errors.email}</em> : null}
      </div>
      <div className="mb-2">
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" className="w-full border border-black/50 bg-white" />
        {errors?.password ? <em role='alert' className="text-red-400 text-sm">{errors.password}</em> : null}
      </div>
      <div className="mb-2">
        <label htmlFor="confirm_password">Confirm Password</label>
        <input type="password" name="confirm_password" id="confirm_password" className="w-full border border-black/50 bg-white" />
      </div>
      <button type="submit" className="border rounded-md px-4 py-2 bg-sky-500/100 text-sm text-white">Submit</button>
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
