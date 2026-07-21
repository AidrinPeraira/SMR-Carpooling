"use client";

import { SortOrder } from "@sharemyride/shared";
import { DropDown, Label } from "@sharemyride/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface SortProps {
  sortFields: string[];
}

export function Sort({ sortFields }: SortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortField = searchParams.get("sortField") ?? "None";
  const currentSortOrder = searchParams.get("sortOrder") ?? SortOrder.ASC;

  const fieldOptions = [
    { label: "None", value: "None" },
    ...sortFields.map((field) => {
      const label = field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      return { label, value: field };
    }),
  ];

  const orderOptions = [
    { label: "A->Z", value: SortOrder.ASC },
    { label: "Z->A", value: SortOrder.DESC },
  ];

  function setSortField(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "None") {
      params.delete("sortField");
      params.delete("sortOrder");
    } else {
      params.set("sortField", value);
      params.set("sortOrder", SortOrder.ASC);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function setSortOrder(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortOrder", value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col p-2 gap-1">
      <Label>Sort</Label>
      <div className="flex gap-2">
        <DropDown
          key={currentSortField}
          defaultValue={currentSortField}
          options={fieldOptions}
          onChange={setSortField}
        />
        <DropDown
          key={currentSortOrder}
          defaultValue={currentSortOrder}
          options={orderOptions}
          onChange={setSortOrder}
        />
      </div>
    </div>
  );
}
