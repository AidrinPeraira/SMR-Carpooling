import { useState, useRef, useEffect } from "react";
import { cn } from "../../../utils";

export interface DropDownOptions {
  label: string;
  value: string;
}

export interface DropDownProps {
  defaultValue: string;
  options: DropDownOptions[];
  onChange?: (value: string) => void;
}

export function DropDown({ defaultValue, options, onChange }: DropDownProps) {
  const [selected, setSelected] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // To handle closing the dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // We add that function as an event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup for listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayLabel =
    options.find((opt) => opt.value === selected)?.label ?? selected;

  return (
    <div ref={containerRef} className="relative inline-block cursor-pointer">
      <div
        className="border w-fit rounded-sm border-border-strong bg-surface-card shadow-sm flex items-center justify-between gap-4 pl-3 pr-2 py-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs text-content-primary">{displayLabel}</span>
        <span className="text-content-secondary text-xs leading-none">
          &#9662;
        </span>
      </div>

      <div
        hidden={!isOpen}
        className="absolute z-10 mt-1 w-full border border-border-strong bg-surface-card rounded-sm flex flex-col gap-1 shadow-lg"
      >
        {options.map((v) => {
          const isSelected = selected === v.value;
          return (
            <p
              key={v.label}
              className={cn(
                "text-xs w-full hover:bg-surface-sidebar/70 text-content-secondary pl-3 pr-5 py-1.5 transition-colors",
                isSelected &&
                  "bg-surface-sidebar text-content-primary font-semibold",
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(v.value);
                setIsOpen(false); // Close menu on selection
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
    </div>
  );
}
