import type { ReactNode } from "react";

export interface Column<T> {
  headerName: string;
  fieldName?: keyof T;
  customRender?: (value: unknown, row: T) => ReactNode;
  align?: "left" | "right" | "center";
}

export interface TableProps<T> {
  columnNames: Column<T>[];
  data: T[];
}

const alignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Table<T>({ columnNames, data }: TableProps<T>) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border border-border-subtle">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-strong bg-surface-sidebar text-content-secondary font-semibold">
              {columnNames.map((v, idx) => {
                return (
                  <th
                    key={idx}
                    className={`p-2.5 ${alignMap[v.align ?? "left"]}`}
                  >
                    {v.headerName}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columnNames.length}
                  className="p-8 text-center text-content-secondary font-medium"
                >
                  No data to display
                </td>
              </tr>
            ) : (
              data.map((d, rowIndex) => {
                return (
                  <tr
                    key={rowIndex}
                    className="border-b border-border-subtle transition-colors hover:bg-surface-muted"
                  >
                    {columnNames.map((h, colIndex) => {
                      return (
                        <td
                          key={colIndex}
                          className={`p-2.5 font-medium text-content-primary ${alignMap[h.align ?? "left"]}`}
                        >
                          {h.customRender
                            ? h.fieldName
                              ? h.customRender(d[h.fieldName], d)
                              : h.customRender(undefined, d)
                            : h.fieldName
                              ? String(d[h.fieldName] ?? "")
                              : ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
