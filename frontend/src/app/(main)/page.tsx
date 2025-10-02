import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ClientHome } from "~/components/client-home";
import { auth } from "~/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/auth/sign-in");

  return (
    <ClientHome />
  );
}
