import { Button } from "@smr/ui";

interface Props {
  className?: string;
  disabled?: boolean;
}

export function GoogleLogin({ className, disabled = false }: Props) {
  return (
    <Button className={className} variant="secondary" disabled={disabled}>
      Google Login
    </Button>
  );
}
