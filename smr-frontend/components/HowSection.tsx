import { Card, CardBody, CardFooter, CardHeader } from "@smr/ui";
import { Banknote, SearchCheck, Users } from "lucide-react";

export function HowSection() {
  return (
    <section className="bg-surface-primary py-12 w-full max-w-5xl flex flex-col aligh-items justify-center mx-auto">
      <h1 className="text-2xl mx-auto font-bold text-fg-primary">
        Riding together made easy
      </h1>
      <div className="h-[4px] bg-accent w-[80px] mx-auto mt-3 rounded-full" />
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <div className="bg-accent h-fit w-fit p-2 rounded rounded-lg">
              <SearchCheck size={16} className="text-fg-primary" />
            </div>
          </CardHeader>
          <CardBody className="text-fg-primary font-bold text-lg mt-4">
            Search your route
          </CardBody>
          <CardFooter className="text-fg-secondary font-medium mt-2 text-sm">
            Enter your destiniation and find thousands of verified rides
            instantly. Filter by preferences and car type.
          </CardFooter>
        </Card>
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <div className="bg-accent h-fit w-fit p-2 rounded rounded-lg">
              <Banknote size={16} className="text-fg-primary" />
            </div>
          </CardHeader>
          <CardBody className="text-fg-primary font-bold text-lg mt-4">
            Book and Pay
          </CardBody>
          <CardFooter className="text-fg-secondary font-medium mt-2 text-sm">
            Reserver your seats via our secure platform. Payment is released to
            the driver only after the trip ends.
          </CardFooter>
        </Card>
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <div className="bg-accent h-fit w-fit p-2 rounded rounded-lg">
              <Users size={16} className="text-fg-primary" />
            </div>
          </CardHeader>
          <CardBody className="text-fg-primary font-bold text-lg mt-4">
            Travel and Connect
          </CardBody>
          <CardFooter className="text-fg-secondary font-medium mt-2 text-sm">
            Enjoy a safe trip with like minded commuters. Rate you experience to
            maintain community standards.
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
