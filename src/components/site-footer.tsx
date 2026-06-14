import { Scissors } from "lucide-react";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Scissors className="size-4 text-brand" aria-hidden />
            {site.name}
          </div>
          <p className="text-sm text-muted-foreground">{site.tagline}</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Instagram
            </a>
            <a
              href={site.contact.phoneHref}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Call
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Email
            </a>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Book
            </a>
          </nav>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} {site.name} · Tyabb VIC · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
