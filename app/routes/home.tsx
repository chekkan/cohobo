import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { redirect } from "react-router";
import { PrismaClient } from "@prisma/client";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const prisma = new PrismaClient();
  const allUsers = await prisma.user.findMany();
  if (allUsers.length == 0) {
    return redirect('/setup');
  }
  return null;
}

export default function Home() {
  return <Welcome />;
}
