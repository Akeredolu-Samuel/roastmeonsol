import { notFound } from "next/navigation";
import { getShare } from "@/lib/share-cache";
import RoastCard from "@/components/RoastCard";
import Donate from "@/components/Donate";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const row = getShare(id);
  if (!row?.roast) {
    return { title: "roastmeonsol" };
  }
  const roast = row.roast;
  const image = `/api/share/${id}/image`;
  return {
    title: `${roast.title} — ${roast.score}/100`,
    description: roast.verdict || roast.roast,
    openGraph: {
      title: `${roast.title} · ${roast.score}/100`,
      description: roast.verdict || roast.roast,
      type: "website",
      images: [{ url: image, width: 960, height: 540, alt: roast.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${roast.title} · ${roast.score}/100`,
      description: roast.verdict || roast.roast,
      images: [image],
    },
  };
}

export default async function RoastSharePage({ params }) {
  const { id } = await params;
  const row = getShare(id);
  if (!row?.roast) notFound();

  return (
    <main className="dots min-h-[100svh] px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-rm-faint">
          roastmeonsol
        </p>
        <RoastCard roast={row.roast} />
        <div className="mt-16">
          <Donate />
        </div>
      </div>
    </main>
  );
}
