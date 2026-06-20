import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next"; // <-- Додано імпорт Metadata
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

// Виносимо тип Props, щоб він був доступний для generateMetadata
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  
  return {
    title: `Note: ${note?.title || "Untitled"}`,
    description: note?.content?.slice(0, 30) || "",
    openGraph: {
      title: `Note: ${note?.title || "Untitled"}`,
      description: note?.content?.slice(0, 50) || "",
      url: `https://08-zustand-xi-sage.vercel.app/notes/${id}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note?.title || "Note Image",
        },
      ],
      type: "article",
    },
  };
}

export default async function NoteDetailsPage({ params }: Props) { // <-- Використовуємо той самий тип Props
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}