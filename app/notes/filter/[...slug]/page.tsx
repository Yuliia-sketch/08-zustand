import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

// Оголошуємо тип для пропсів цієї сторінки
type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "all" ? "All Notes" : slug[0];
  return {
    title: `NoteHub | ${tag}`,
    description: `Search by tag: ${tag}`,
    openGraph: {
      title: `NoteHub | ${tag}`,
      description: `Search by tag: ${tag}`,
      url: `https://08-zustand-xi-sage.vercel.app/notes/filter/${tag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${tag}`,
        },
      ],
      type: "website",
    },
  };
}

export default async function NotesByTagPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: 1, search: "", tag }],
    queryFn: () => fetchNotes(undefined, 1, 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}