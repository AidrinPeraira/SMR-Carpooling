import { cn } from "@smr/ui";
import Image from "next/image";

interface Props {
  className?: string;
}

export function AuthHero({ className }: Props) {
  const baseStyles = "relative w-full h-full overflow-hidden";
  return (
    <div className={cn(className, baseStyles)}>
      <Image
        src="/SignupPage.png"
        alt="Image of people sharing car"
        fill
        className="object-cover"
        sizes="50vw"
        priority
      />
      <div
        className="absolute inset-0
      flex flex-col justify-end p-16 text-white
      bg-gradient-to-t from-black/80 via-black/20
      to-transparent"
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Join the green mobility revolution
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-white/90 leading-relaxed">
            Connect with fellow commuters, reduce your carbon footprint, and
            save on travel costs. Thousands are already carpooling towards a
            greener future.
          </p>
        </div>
      </div>
    </div>
  );
}
