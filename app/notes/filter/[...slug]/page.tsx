import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { NoteTag } from '@/types/note';

type Props = {
  params: Promise<{ slug: string[] }>;
};

const NotesFilterPage = async ({ params }: Props) => {
  const { slug } = await params;
  const tag = slug[0] as NoteTag | 'All' | undefined;
  const initialData = await fetchNotes({
    page: 1,
    perPage: 9,
    search: '',
    ...(tag && tag !== 'All' && { tag }),
  });

  return <NotesClient initialData={initialData} tag={tag} />;
};
export default NotesFilterPage;
