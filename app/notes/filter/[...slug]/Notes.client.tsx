'use client';

import css from '@/components/NotesPage/NotesPage.module.css';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes, FetchNotesResponse } from '@/lib/api';
import { useDebouncedCallback } from 'use-debounce';
import { NoteTag } from '@/types/note';

export interface NoteClientProps {
  initialData: FetchNotesResponse;
  tag?: NoteTag | undefined | 'All';
}

export default function NotesClient({ initialData, tag }: NoteClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');
  const perPage = 9;
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const updateSearchTopic = useDebouncedCallback((newSearchTopic: string) => {
    setSearchTopic(newSearchTopic);
    setCurrentPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', searchTopic, currentPage, tag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage,
        search: searchTopic,
        ...(tag && tag !== 'All' ? { tag } : {}),
      }),
    placeholderData: keepPreviousData,
    initialData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <h2>Failed to load notes</h2>;

  const notesToDisplay = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <main>
        <section>
          <header className={css.toolbar}>
            <SearchBox value={searchTopic} onSearch={updateSearchTopic} />
            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            )}
            <button className={css.button} onClick={openModal}>
              Create note +
            </button>
          </header>
          {data && !isLoading && <NoteList notes={notesToDisplay} />}
          {isModalOpen && (
            <Modal onClose={closeModal}>
              <NoteForm onCloseModal={closeModal} />
            </Modal>
          )}
        </section>
      </main>
    </div>
  );
}
