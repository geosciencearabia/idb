import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Loader2, Link2, BookOpen } from "lucide-react";
import { searchAuthors, getAuthorWorks, type OpenAlexAuthor, type OpenAlexWork } from "@/services/openAlex";
import { useToast } from "@/hooks/use-toast";
import { SiteShell } from "@/components/SiteShell";

export default function AuthorManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OpenAlexAuthor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [workPreviews, setWorkPreviews] = useState<Record<string, OpenAlexWork[]>>({});
  const [loadingWorks, setLoadingWorks] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchAuthors(searchQuery);
      setSearchResults(results);
      toast({
        title: "Search complete",
        description: `Found ${results.length} authors`,
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search authors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadWorks = async (author: OpenAlexAuthor) => {
    if (workPreviews[author.id]) return;
    setLoadingWorks((prev) => ({ ...prev, [author.id]: true }));
    try {
      const works = await getAuthorWorks(author.id);
      const sorted = [...works].sort((a, b) => (b.publication_year || 0) - (a.publication_year || 0));
      setWorkPreviews((prev) => ({ ...prev, [author.id]: sorted.slice(0, 5) }));
      toast({
        title: "Loaded sample works",
        description: `Showing recent titles for ${author.display_name}`,
      });
    } catch (error) {
      toast({
        title: "Could not load works",
        description: "Failed to fetch author works. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingWorks((prev) => ({ ...prev, [author.id]: false }));
    }
  };

  const hasResults = useMemo(() => searchResults.length > 0, [searchResults]);

  return (
    <SiteShell>
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Author ID finder</h1>
          <p className="text-muted-foreground text-sm">
            Search OpenAlex by name to confirm the correct author ID using their works and metrics.
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Authors
            </CardTitle>
            <CardDescription>Search for authors by name, ORCID, or affiliation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                placeholder="Enter author name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching} className="flex items-center gap-2">
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Results
            </CardTitle>
            <CardDescription>Use the sample works to verify the correct OpenAlex author ID.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchResults.map((author) => {
              const works = workPreviews[author.id];
              const isLoading = loadingWorks[author.id];
              const openAlexUrl = author.id?.replace("https://api.openalex.org", "https://openalex.org");
              return (
                <Card key={author.id} className="border border-border/60">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="text-lg font-semibold text-foreground">{author.display_name}</div>
                        {author.last_known_institution?.display_name && (
                          <div className="text-xs text-muted-foreground">
                            {author.last_known_institution.display_name}
                            {author.last_known_institution.country_code ? ` (${author.last_known_institution.country_code})` : ""}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <a
                            href={openAlexUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline inline-flex items-center gap-1"
                          >
                            View on OpenAlex <ExternalLink className="h-3 w-3" />
                          </a>
                          <span className="text-muted-foreground">·</span>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 underline"
                            onClick={() => navigator.clipboard?.writeText(author.id).catch(() => {})}
                            title="Copy OpenAlex ID"
                          >
                            <Link2 className="h-3 w-3" />
                            Copy ID
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary">{author.works_count} publications</Badge>
                        <Badge variant="secondary">{author.cited_by_count} citations</Badge>
                        <Badge variant="secondary">h-index: {author.h_index}</Badge>
                        <Badge variant="secondary">i10: {author.i10_index}</Badge>
                      </div>
                    </div>

                    <div className="rounded-md border border-dashed border-border/60 bg-muted/40 p-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <BookOpen className="h-4 w-4 text-primary" />
                          Recent titles
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLoadWorks(author)}
                          disabled={isLoading}
                          className="flex items-center gap-1"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                          {works ? "Reload" : "Load"}
                        </Button>
                      </div>
                      {works ? (
                        <ul className="space-y-2 text-sm">
                          {works.map((work) => (
                            <li key={work.id} className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {work.publication_year ? `${work.publication_year} · ` : ""}
                                {work.title || "Untitled work"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {(work.primary_location?.source?.display_name && `${work.primary_location.source.display_name}`) ||
                                  "Venue n/a"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Load a few recent works to verify this is the right author.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {!hasResults && (
              <p className="text-sm text-muted-foreground">
                No results yet. Search by full name (e.g., “Jane Q. Doe”) to see candidate author IDs.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </SiteShell>
  );
}
