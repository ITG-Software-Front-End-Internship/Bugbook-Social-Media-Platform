"use server";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { TrendingTopics } from "./components/trendingTopics/TrendingTopics";
import WhoToFollow from "./components/whoToFollow/WhoToFollow";

export default async function TrendsSidebar() {
  console.log(`Trends side bar ... `);

  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <div className="space-y-5">
          <WhoToFollow />
          <TrendingTopics />
        </div>
      </Suspense>
    </div>
  );
}
