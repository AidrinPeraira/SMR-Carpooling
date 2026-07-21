import { Button } from "../../actions";
import { Card, CardBody, CardFooter, CardHeader } from "../../data-display";
import { cn } from "../../../utils";

export interface DialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  header: string;
  description: string;
  confirmAction?: () => void;
  rejectAction?: () => void;
  className?: string;
}

export function Dialog({
  isOpen = false,
  onClose,
  header,
  description,
  confirmAction,
  rejectAction,
  className,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <Card
        className={cn("p-0 min-w-sm max-w-md w-full m-2 relative", className)}
      >
        <CardHeader className="flex flex-row justify-between mx-4 my-1 mt-2 items-center">
          <h1 className="mt-1 text-content-primary text-fg-primary font-bold">
            {header}
          </h1>
          {onClose && (
            <button
              onClick={onClose}
              className="text-fg-secondary hover:text-fg-primary text-lg cursor-pointer transition-colors p-1"
              aria-label="Close dialog"
            >
              &times;
            </button>
          )}
        </CardHeader>
        <CardBody className="mx-4 text-content-secondary mb-4 text-xs">
          {description}
        </CardBody>
        <CardFooter className="flex flex-row-reverse gap-4 px-4 w-full py-3 border-t border-border-subtle bg-surface-sidebar">
          <Button className="text-xs px-5 py-1" onClick={confirmAction}>
            Accept
          </Button>
          <Button
            className="text-xs px-2 py-1"
            variant="ghost"
            onClick={rejectAction || onClose}
          >
            Reject
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
