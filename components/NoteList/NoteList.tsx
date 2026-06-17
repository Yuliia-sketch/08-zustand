import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import Link from "next/link";

interface NoteListProps {
  onSelect: (note: Note) => void;
  notes: Note[];
}

export default function NoteList({ onSelect, notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (notes.length === 0) {
    return null;
  }
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li
          className={css.listItem}
          onClick={() => onSelect(note)}
          key={note.id}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`} className={css.detailsLink}>
              View details
            </Link>
            <button
              className={css.button}
              disabled={mutation.isPending}
              onClick={(e) => {
                e.stopPropagation();
                mutation.mutate(note.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}