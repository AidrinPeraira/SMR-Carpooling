import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tag,
  Button,
} from "@smr/ui";
import {
  Star,
  CheckCircle,
  CigaretteOff,
  Dog,
  Car,
  Luggage,
} from "lucide-react";
import Link from "next/link";

export function RideSection() {
  return (
    <section className="bg-surface-secondary w-full py-12">
      <div className="mx-auto px-4 md:px-8 max-w-5xl">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-1">
            <span className="text-accent text-xs font-bold uppercase tracking-widest">
              POPULAR ROUTES
            </span>
            <h2 className="text-2xl text-content-primary font-bold">
              Nearby active pools
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Trip Card 1 */}
          <Card className="hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="flex flex-row justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                <Avatar
                  src="https://i.pravatar.cc/300"
                  alt="Julian"
                  initials="JU"
                />
                <div>
                  <h4 className="text-sm font-bold text-content-primary flex items-center gap-1">
                    Julian <CheckCircle size={16} className="text-accent" />
                  </h4>
                  <p className="text-xs text-content-secondary flex items-center gap-1">
                    4.9 <Star size={12} fill="currentColor" /> (128 rides)
                  </p>
                </div>
              </div>
              <Tag
                variant="accent"
                className="text-xs rounded-full px-3 py-1 font-bold"
              >
                verified
              </Tag>
            </CardHeader>

            <CardBody className="space-y-4 py-4 border-y border-border-strong mb-4">
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-3 h-3 rounded-full border-2 border-accent"></div>
                  <div className="w-[2px] h-8 bg-border-strong"></div>
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-content-primary leading-none mb-1">
                      Trivandrum
                    </p>
                    <p className="text-xs text-content-tertiary">
                      Kazhakootam • 08:30 AM
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-content-primary leading-none mb-1">
                      Kochi
                    </p>
                    <p className="text-xs text-content-tertiary">
                      Edappaly • 09:45 AM
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>

            <CardFooter className="flex gap-2 overflow-x-auto pb-1">
              <span className="whitespace-nowrap bg-surface-muted text-content-secondary px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
                <CigaretteOff size={14} /> No Smoking
              </span>
              <span className="whitespace-nowrap bg-surface-muted text-content-secondary px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
                <Dog size={14} /> Pets Allowed
              </span>
            </CardFooter>
          </Card>

          {/* Trip Card 2 */}
          <Card className="hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="flex flex-row justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                <Avatar
                  src="https://i.pravatar.cc/300?img=4"
                  alt="Elena"
                  initials="EL"
                />
                <div>
                  <h4 className="text-sm font-bold text-content-primary flex items-center gap-1">
                    Elena <CheckCircle size={16} className="text-accent" />
                  </h4>
                  <p className="text-xs text-content-secondary flex items-center gap-1">
                    5.0 <Star size={12} fill="currentColor" /> (42 rides)
                  </p>
                </div>
              </div>
              <Tag
                variant="accent"
                className="text-xs rounded-full px-3 py-1 font-bold"
              >
                verified
              </Tag>
            </CardHeader>

            <CardBody className="space-y-4 py-4 border-y border-border-strong mb-4">
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-3 h-3 rounded-full border-2 border-accent"></div>
                  <div className="w-[2px] h-8 bg-border-strong"></div>
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-content-primary leading-none mb-1">
                      Kozhikode
                    </p>
                    <p className="text-xs text-content-tertiary">
                      West Hill • 07:15 AM
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-content-primary leading-none mb-1">
                      Kochi
                    </p>
                    <p className="text-xs text-content-tertiary">
                      Maradu • 08:30 AM
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>

            <CardFooter className="flex gap-2 overflow-x-auto pb-1">
              <span className="whitespace-nowrap bg-surface-muted text-content-secondary px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
                <Car size={14} /> Electric Car
              </span>
              <span className="whitespace-nowrap bg-surface-muted text-content-secondary px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
                <Luggage size={14} /> 2 bags max
              </span>
            </CardFooter>
          </Card>

          {/* CTA Feature Card */}
          <div className="bg-accent p-6 flex flex-col justify-between text-accent-fg relative overflow-hidden group min-h-[300px] rounded-lg shadow-sm border border-border-subtle md:col-span-2 lg:col-span-1">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="space-y-4 relative z-10">
              <h3 className="text-2xl font-bold">Heading somewhere?</h3>
              <p className="text-sm text-accent-fg/80 leading-relaxed">
                Publish your ride and start saving on fuel costs while helping
                the environment.
              </p>
            </div>
            <Link href="/auth/signup">
              <Button
                variant="secondary"
                className="relative z-10 w-full h-12 flex items-center justify-center bg-surface-base text-content-primary hover:bg-surface-muted transition-all rounded-lg"
              >
                Join Now!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
