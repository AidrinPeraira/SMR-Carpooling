"use client";

import { DropDown, Label } from "@sharemyride/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface FilterProps {
  filters: Record<string, string[]>;
}

export function Filter({ filters }: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilterField = searchParams.get("filterField") ?? "None";
  const currentFilterValue = searchParams.get("filterValue") ?? "None";

  const fieldOptions = [
    { label: "None", value: "None" },
    ...Object.keys(filters).map((field) => {
      const label = field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      return { label, value: field };
    }),
  ];

  const availableOptions =
    currentFilterField !== "None" ? (filters[currentFilterField] ?? []) : [];

  const valueOptions = [
    { label: "None", value: "None" },
    ...availableOptions.map((val) => {
      const label = val
        .replace(/_/g, " ")
        .replace(/\b\w/g, (str) => str.toUpperCase());
      return { label, value: val };
    }),
  ];

  function setFilterField(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "None") {
      params.delete("filterField");
      params.delete("filterValue");
    } else {
      params.set("filterField", value);
      params.delete("filterValue"); // Reset value to prevent mismatched fields
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function setFilterValue(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "None") {
      params.delete("filterValue");
    } else {
      params.set("filterValue", value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col p-2 gap-1">
      <Label>Filter</Label>
      <div className="flex gap-2">
        <DropDown
          key={currentFilterField}
          defaultValue={currentFilterField}
          options={fieldOptions}
          onChange={setFilterField}
        />
        <DropDown
          key={`${currentFilterField}-${currentFilterValue}`}
          defaultValue={currentFilterValue}
          options={valueOptions}
          onChange={setFilterValue}
        />
      </div>
    </div>
  );
}
