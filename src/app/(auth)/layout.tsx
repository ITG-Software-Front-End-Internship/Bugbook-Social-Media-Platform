import { cachedValidateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await cachedValidateRequest();

  if (user) redirect("/");

  return <>{children}</>;
}
