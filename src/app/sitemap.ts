import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.chamdan.site";

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  try {
    // Dynamic projects
    const { data: projects } = await supabase.from("projects").select("id, created_at");
    if (projects) {
      projects.forEach((p) => {
        routes.push({
          url: `${baseUrl}/projects/${p.id}`,
          lastModified: new Date(p.created_at || Date.now()),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      });
    }

    // Dynamic writings
    const { data: writings } = await supabase.from("writings").select("slug, created_at");
    if (writings) {
      writings.forEach((w) => {
        if (w.slug) {
          routes.push({
            url: `${baseUrl}/writings/${w.slug}`,
            lastModified: new Date(w.created_at || Date.now()),
            changeFrequency: "monthly",
            priority: 0.8,
          });
        }
      });
    }
  } catch (err) {
    console.error("Sitemap generation error:", err);
  }

  return routes;
}
