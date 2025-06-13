import TrendsSidebar from "@/components/customComponents/TrendsSidebar/TrendsSidebar";
import { notificationsTranslations } from "@/lib/translationKeys";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Notifications from "./components/notifications/Notifications";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function page() {
  const t = await getTranslations();

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">
            {t(notificationsTranslations.title)}
          </h1>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  );
}
