"use client";

import { ItemsPerPage as IPP } from "@sharemyride/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ItemsPerPage({ totalItems }: { totalItems?: number }) {
  const currentParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const currentLimit = Number(currentParams.get("limit")) || 10;

  function handleChange(value: number) {
    const params = new URLSearchParams(currentParams);
    params.set("limit", value.toString());
    params.set("page", "1");
    router.replace(`${path}?${params.toString()}`);
  }

  return (
    <IPP value={currentLimit} onChange={handleChange} totalItems={totalItems} />
  );
}
