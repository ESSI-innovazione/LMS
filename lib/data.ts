import { createClient } from "@supabase/supabase-js";
import { EPISODES, type Episode, type Profile } from "./catalog";

type EpisodeRow = {
  num: number;
  season_id: number;
  release_month: number;
  title: string;
  topic: string;
  area: string;
  duration_min: number;
  extra_code: string | null;
  mandatory_profiles: string[] | null;
};

const PROFILES: Profile[] = ["operativo", "amministrativo", "management"];

function isProfile(value: string): value is Profile {
  return (PROFILES as string[]).includes(value);
}

export type CatalogSource = "supabase" | "static";

export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Reads the catalogue from Supabase; falls back to the static list if Supabase
// is not configured, unreachable, or not seeded yet.
export async function getEpisodes(): Promise<{ episodes: Episode[]; source: CatalogSource }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { episodes: EPISODES, source: "static" };

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("episodes")
      .select("num, season_id, release_month, title, topic, area, duration_min, extra_code, mandatory_profiles")
      .order("num", { ascending: true });

    if (error || !data || data.length === 0) return { episodes: EPISODES, source: "static" };

    const episodes: Episode[] = (data as unknown as EpisodeRow[]).map((r) => ({
      num: r.num,
      season: r.season_id,
      month: r.release_month,
      title: r.title,
      topic: r.topic,
      area: r.area,
      durationMin: r.duration_min,
      extra: r.extra_code,
      mandatoryFor: (r.mandatory_profiles ?? []).filter(isProfile),
    }));
    return { episodes, source: "supabase" };
  } catch {
    return { episodes: EPISODES, source: "static" };
  }
}
