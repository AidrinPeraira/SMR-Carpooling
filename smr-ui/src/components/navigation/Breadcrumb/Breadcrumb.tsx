export interface BreadcrumbProps {
  /**
   * The current path string (e.g. "/rides/smr-102" or "rides/smr-102")
   */
  path: string;
  /**
   * Optional className to override styles
   */
  className?: string;
}

export function Breadcrumb({ path, className }: BreadcrumbProps) {
  // Normalize path and split into segments
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const segments = cleanPath ? cleanPath.split("/") : [];

  // Simple formatter to convert kebab-case segments to Title Case
  const formatLabel = (segment: string): string => {
    if (!segment) return "";
    if (segment.toLowerCase() === "smr-102") return "SMR-102";
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="inline-flex items-center space-x-1 md:space-x-2 text-xs font-medium">
        <li className="inline-flex items-center">
          <span className="inline-flex items-center text-content-secondary">
            <svg
              className="w-3.5 h-3.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Home
          </span>
        </li>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const label = formatLabel(segment);

          return (
            <li key={segment} aria-current={isLast ? "page" : undefined}>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-content-tertiary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {isLast ? (
                  <span className="ml-1 md:ml-2 font-semibold text-content-primary">
                    {label}
                  </span>
                ) : (
                  <span className="ml-1 md:ml-2 text-content-secondary">
                    {label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
