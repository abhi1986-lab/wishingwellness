import { WishingWellnessSite } from "./WishingWellnessSite";
import { loadSiteContentWithFallback } from "./site-content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await loadSiteContentWithFallback();

  return <WishingWellnessSite content={content} />;
}
