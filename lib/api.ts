import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

interface HTTPResponse {
  notes: Note[];
  totalPages: number;
}

export type NewNoteData = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const fetchNotes = async (
  searchTerm?: string,
  page: number = 1,
  perPage: number = 12,
  tag?: string,
) => {
  const response = await instance.get<HTTPResponse>("/notes", {
    params: {
      search: searchTerm?.trim() || undefined,
      page,
      perPage,
      tag,
    },
  });

  return response.data;
};

export const createNote = async (data: NewNoteData): Promise<Note> => {
  const response = await instance.post<Note>("/notes", data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
};