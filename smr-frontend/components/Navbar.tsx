import { Button } from "@sharemyride/ui";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="w-full bg-surface-primary p-1 text-sm flex flex-row justify-between items-center">
      <div>
        <Image
          className="m-2 dark:hidden"
          src="/SMRFullTextLogoBlack.png"
          alt="Share My Ride logo"
          height={40}
          width={120}
        />
        <Image
          className="m-2 hidden dark:block"
          src="/SMRFullTextLogoWhite.png"
          alt="Share My Ride logo"
          height={40}
          width={120}
        />
      </div>
      <div className="flex gap-2 m-2">
        <Link href="/auth/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/auth/signup">
          <Button variant="primary">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}
