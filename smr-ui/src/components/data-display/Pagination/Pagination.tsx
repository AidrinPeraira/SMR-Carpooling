import { Button } from "../../actions";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onSelect: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onSelect,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  return (
    <div
      className="flex gap-2"
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <PaginationLeft
        page={currentPage}
        variant="secondary"
        onSelect={onSelect}
      />
      <PaginationPage
        page={currentPage - 1}
        totalPages={totalPages}
        variant="secondary"
        onSelect={onSelect}
      />
      <PaginationPage
        page={currentPage}
        totalPages={totalPages}
        variant="primary"
        onSelect={onSelect}
      />
      <PaginationPage
        page={currentPage + 1}
        totalPages={totalPages}
        variant="secondary"
        onSelect={onSelect}
      />
      <PaginationRight
        page={currentPage}
        totalPages={totalPages}
        variant="secondary"
        onSelect={onSelect}
      />
    </div>
  );
}

interface PaginationPageProps {
  page: number;
  totalPages: number;
  variant: "secondary" | "primary";
  onSelect: (page: number) => void;
}

function PaginationLeft({
  page,
  variant,
  onSelect,
}: Omit<PaginationPageProps, "totalPages">) {
  function handlePrevPageSelection() {
    if (page > 1) {
      onSelect(page - 1);
    }
  }
  return (
    <Button
      variant={variant}
      onClick={handlePrevPageSelection}
      disabled={page <= 1}
      aria-label="Go to previous page"
    >
      Prev
    </Button>
  );
}

function PaginationRight({
  page,
  totalPages,
  variant,
  onSelect,
}: PaginationPageProps) {
  function handleNextPageSelection() {
    if (page < totalPages) {
      onSelect(page + 1);
    }
  }
  return (
    <Button
      variant={variant}
      onClick={handleNextPageSelection}
      disabled={page >= totalPages}
      aria-label="Go to next page"
    >
      Next
    </Button>
  );
}

function PaginationPage({
  page,
  totalPages,
  variant,
  onSelect,
}: PaginationPageProps) {
  if (page <= 0 || page > totalPages) {
    return null;
  }

  const isActive = variant === "primary";

  return (
    <Button
      variant={variant}
      onClick={() => onSelect(page)}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Go to page ${page}`}
    >
      {page.toString()}
    </Button>
  );
}
