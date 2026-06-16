import { Button } from "@smr/ui";

interface Props {
  className?: string;
}

export function GoogleLogin({ className }: Props) {
  return (
    <Button className={className} variant="secondary">
      Google Login
    </Button>
  );
}
