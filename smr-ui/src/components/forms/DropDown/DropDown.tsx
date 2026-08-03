import { useState, useRef, useEffect } from "react";
import { cn } from "../../../utils";

export interface DropDownOptions {
  label: string;
  value: string;
}

export interface DropDownProps {
  defaultValue?: string;
  value?: string;
  options: DropDownOptions[];
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function DropDown({
  defaultValue = "",
  value,
  options,
  onChange,
  className,
  disabled = false,
  placeholder = "Select option",
}: DropDownProps) {
  const [selected, setSelected] = useState(value !== undefined ? value : defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    } else if (defaultValue !== undefined) {
      setSelected(defaultValue);
    }
  }, [value, defaultValue]);

  // Handle closing the dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedValue = value !== undefined ? value : selected;
  const matchedOption = options.find((opt) => opt.value === selectedValue);
  const displayLabel = matchedOption ? matchedOption.label : (selectedValue || placeholder);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full cursor-pointer select-none",
        disabled && "opacity-60 pointer-events-none",
        className,
      )}
    >
      <div
        className="w-full rounded-sm border border-border-strong bg-surface-card shadow-sm flex items-center justify-between gap-2 px-3 py-1.5 min-h-[34px]"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="text-xs text-content-primary truncate flex-1 text-left">
          {displayLabel}
        </span>
        <span className="text-content-secondary text-xs leading-none shrink-0">
          &#9662;
        </span>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 right-0 z-50 mt-1 w-full max-h-60 overflow-y-auto border border-border-strong bg-surface-card rounded-sm flex flex-col gap-1 shadow-lg"
        >
          {options.map((v) => {
            const isSelected = selectedValue === v.value;
            return (
              <p
                key={v.value + v.label}
                className={cn(
                  "text-xs w-full hover:bg-surface-sidebar/70 text-content-secondary px-3 py-1.5 transition-colors cursor-pointer truncate",
                  isSelected &&
                    "bg-surface-sidebar text-content-primary font-semibold",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(v.value);
                  setIsOpen(false);
                  if (onChange) {
                    onChange(v.value);
                  }
                }}
              >
                {v.label}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
