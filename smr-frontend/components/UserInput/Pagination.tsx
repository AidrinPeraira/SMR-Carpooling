"use client";

import { Pagination as P } from "@smr/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Pagination({
  currentPage = 1,
  totalPages = 1,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const currentParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  function handleSelectPage(page: number) {
    const params = new URLSearchParams(currentParams);
    params.set("page", page.toString());
    params.set("limit", "10");
    router.replace(`${path}?${params.toString()}`);
  }

  return (
    <div className="flex justify-center w-full ">
      <P
        currentPage={currentPage}
        totalPages={totalPages}
        onSelect={handleSelectPage}
      />
    </div>
  );
}
