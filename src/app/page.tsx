import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Scissors,
  Sparkles,
} from "lucide-react";

import { InstagramIcon } from "@/components/icons";
import { InstagramFeed } from "@/components/instagram-feed";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { services, site, team } from "@/lib/site";

const values = [
  {
    title: "Industrial",
    body: "A raw, considered space with nothing to distract from the craft.",
  },
  {
    title: "Crafted",
    body: "Precision cuts and razor detail, done right the first time.",
  },
  {
    title: "Personal",
    body: "Your chair, your barber, your time — one client at a time.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <>
      {/* Promo bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-5 py-2 text-center text-sm sm:px-6">
          <Sparkles className="hidden size-3.5 sm:block" aria-hidden />
          <span>
            {site.promo.text} — use code{" "}
            <span className="font-semibold text-brand-foreground underline decoration-brand decoration-2 underline-offset-2">
              {site.promo.code}
            </span>{" "}
            at checkout
          </span>
        </div>
      </div>

      <SiteHeader />

      <main id="top" className="flex-1">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden border-b">
          <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32 lg:py-40">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="gap-1.5 rounded-full">
                <MapPin className="size-3" /> Tyabb · By appointment
              </Badge>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Industrial. Crafted.{" "}
                <span className="text-brand">Personal.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
                {site.mission}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={site.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  Book an Appointment
                </a>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                >
                  <InstagramIcon className="size-4" /> {site.instagram.handle}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== About / Mission ===== */}
        <section id="about" className="border-b">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <SectionLabel>Our Mission</SectionLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Precision barbering, built for the culture.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground text-pretty">
                Cult Barber Studio was founded to elevate traditional barbering
                through precision, consistency, and modern style.
              </p>
              <p className="mt-4 text-muted-foreground text-pretty">
                Every appointment is one-on-one — real time, real attention, no
                rush. We take pride in the details: the sharpness of a fade, the
                line of a beard, the finish that has you leaving sharper and more
                confident than you walked in.
              </p>
            </div>
            <div className="grid gap-4 self-center">
              {values.map((v) => (
                <Card key={v.title} className="border-dashed">
                  <CardContent className="flex gap-4 py-5">
                    <Scissors className="mt-0.5 size-5 shrink-0 text-brand" />
                    <div>
                      <h3 className="font-medium">{v.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {v.body}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Services ===== */}
        <section id="services" className="border-b bg-muted/30">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <SectionLabel>The Menu</SectionLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Services &amp; Pricing
              </h2>
              <p className="mt-4 text-muted-foreground">
                All prices in AUD. Book any service online through Square.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <Card
                  key={s.name}
                  className="transition-colors hover:border-foreground/30"
                >
                  <CardContent className="flex items-start justify-between gap-4 py-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{s.name}</h3>
                        {s.popular && (
                          <Badge className="rounded-full px-2 py-0 text-[10px]">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
                        {s.description}
                      </p>
                    </div>
                    <span className="font-mono text-lg font-semibold text-brand">
                      ${s.price}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Book a Service
              </a>
            </div>
          </div>
        </section>

        {/* ===== Team ===== */}
        <section id="team" className="border-b">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <SectionLabel>The Barbers</SectionLabel>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Meet the Team
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((b) => (
                <Card key={b.name} className="overflow-hidden pt-0">
                  <div className="bg-dot-grid flex aspect-[4/3] items-center justify-center border-b bg-muted/40">
                    <span className="text-6xl font-semibold text-muted-foreground/40">
                      {b.name[0]}
                    </span>
                  </div>
                  <CardContent>
                    <h3 className="text-xl font-semibold">{b.name}</h3>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-brand">
                      {b.role}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground text-pretty">
                      {b.bio}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {b.specialties.map((sp) => (
                        <Badge
                          key={sp}
                          variant="secondary"
                          className="font-normal"
                        >
                          {sp}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Instagram ===== */}
        <section id="gallery" className="border-b bg-muted/30">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <SectionLabel>{site.instagram.handle}</SectionLabel>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Fresh from the chair
                </h2>
                <p className="mt-4 text-muted-foreground">
                  See the latest cuts, fades, and beard work on Instagram.
                </p>
              </div>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <InstagramIcon className="size-4" /> Follow
                <ArrowUpRight className="size-4" />
              </a>
            </div>

            <InstagramFeed />
          </div>
        </section>

        {/* ===== Contact ===== */}
        <section id="contact" className="border-b">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
              <div>
                <SectionLabel>Get in Touch</SectionLabel>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Contact &amp; location
                </h2>

                <dl className="mt-8 space-y-6">
                  <ContactRow icon={<MapPin className="size-4" />} label="Studio">
                    {site.contact.address}
                  </ContactRow>
                  <ContactRow icon={<Phone className="size-4" />} label="Phone">
                    <a className="hover:text-brand" href={site.contact.phoneHref}>
                      {site.contact.phoneDisplay}
                    </a>
                  </ContactRow>
                  <ContactRow icon={<Mail className="size-4" />} label="Email">
                    <a
                      className="hover:text-brand"
                      href={`mailto:${site.contact.email}`}
                    >
                      {site.contact.email}
                    </a>
                  </ContactRow>
                  <ContactRow icon={<Clock className="size-4" />} label="Hours">
                    {site.contact.hours}
                  </ContactRow>
                </dl>

                <Separator className="my-8" />

                <div className="flex flex-wrap gap-3">
                  <a
                    href={site.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants())}
                  >
                    Book Now
                  </a>
                  <a
                    href={site.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Get Directions <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border">
                <iframe
                  title="Cult Barber Studio location — Tyabb"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=145.165%2C-38.270%2C145.205%2C-38.248&layer=mapnik&marker=-38.2585%2C145.1835"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[360px] w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== Booking band ===== */}
        <section id="book" className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Ready for your next cut?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70 text-pretty">
              Booking is quick and easy through Square. Pick your barber, choose a
              time, and you&apos;re set.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}
              >
                Book Your Appointment
              </a>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/70">
              First time? Use code{" "}
              <span className="font-semibold text-brand-foreground underline decoration-brand decoration-2 underline-offset-2">
                {site.promo.code}
              </span>{" "}
              for {site.promo.text.toLowerCase()}.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border text-brand">
        {icon}
      </div>
      <div>
        <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-1 text-foreground">{children}</dd>
      </div>
    </div>
  );
}
