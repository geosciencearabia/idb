import { Mail, Send, Users } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <SiteShell>
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-background to-background p-8 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                GeoArabia
              </p>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Contact &amp; Community
              </h1>
              <p className="text-muted-foreground">
                Get in touch with the GeoArabia team or join the community to collaborate on the dashboard.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section className="rounded-xl border border-border/60 bg-card/50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Email the team</h2>
                  <p className="text-sm text-muted-foreground">
                    Share feedback, requests, or questions about the GeoArabia dashboard.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <a href="mailto:info@geoarabia.com">info@geoarabia.com</a>
                </Button>
              </div>
            </section>

            <section className="rounded-xl border border-border/60 bg-card/50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Add content to the dashboard</h2>
                  <p className="text-sm text-muted-foreground">
                    Share your publication details so they can be included.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdpA038sbSonMbDhbkO0onfOq6pTAJ_3jVIoZxJiG-dyyezEw/viewform"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open submission form
                  </a>
                </Button>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-xl border border-border/60 bg-card/40 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Join the GeoArabia community</h2>
                <p className="text-sm text-muted-foreground">
                  Be part of the GeoArabia community: register your interest today and be the first to know when we launch.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSe0kLkhloMlviuRWSfKp6s1xrSTtp9UI-t7n_TF9U4Hvi9wrQ/viewform"
                  target="_blank"
                  rel="noreferrer"
                >
                  Join the community
                </a>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  );
};

export default Contact;
