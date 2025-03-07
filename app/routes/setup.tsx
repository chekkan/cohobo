import { redirect, useFetcher } from "react-router"

export default function Setup() {
  let fetcher = useFetcher();
  return <div><fetcher.Form method="post"><input name="email" /><input name="password" /><input name="confirm_password" /></fetcher.Form></div>
}

export function action(): Response {
  return redirect('/');
}
