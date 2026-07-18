"use client";

import { Input, Label } from "@smr/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function Search() {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const searchParamValue = searchParams.get("search") ?? "";

  const [value, setValue] = useState(searchParamValue);
  const [prevSearchParam, setPrevSearchParam] = useState(searchParamValue);

  //set prev search param value
  if (searchParamValue !== prevSearchParam) {
    setValue(searchParamValue);
    setPrevSearchParam(searchParamValue);
  }

  //Debouncing search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const currentSearch = params.get("search") ?? "";
      if (currentSearch === value) return;

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="flex flex-col gap-1">
      <Label>Search</Label>
      <Input
        placeholder="Enter your search term"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
