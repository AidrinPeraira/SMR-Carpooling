import { DropDown } from "../../forms";

export interface ItemsPerPageProps {
  value?: number;
  options?: number[];
  onChange: (value: number) => void;
  className?: string;
  totalItems?: number;
}

const DEFAULT_OPTIONS = [10, 25, 50, 100];

export function ItemsPerPage({
  value,
  options = DEFAULT_OPTIONS,
  onChange,
  className,
  totalItems,
}: ItemsPerPageProps) {
  const dropdownOptions = options.map((n) => ({
    label: `${n} / page`,
    value: String(n),
  }));

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <DropDown
        value={value !== undefined ? String(value) : undefined}
        options={dropdownOptions}
        onChange={(v) => onChange(Number(v))}
      />
      {totalItems !== undefined && (
        <span className="text-xs text-content-secondary whitespace-nowrap">
          of {totalItems} items
        </span>
      )}
    </div>
  );
}
