import { cachedValidateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await cachedValidateRequest();

  if (!session.user) redirect("/login");

  return <>{children}</>;
}
