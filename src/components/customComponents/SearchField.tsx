"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Input } from "../ui/input";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const query = (form.query as HTMLInputElement).value.trim();
    if (!query) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="query" placeholder="Search" className="pe-10" />
        <SearchIcon className="text-muted-foreground absolute right-3 top-1/2 size-5 -translate-y-1/2 transform" />
      </div>
    </form>
  );
}
