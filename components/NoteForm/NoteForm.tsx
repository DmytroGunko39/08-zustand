'use client';

import css from './NoteForm.module.css';
import type { NewNoteData, NoteTag } from '../../types/note';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createNote } from '@/lib/api';

export interface NoteFormProps {
  initialValues?: {
    title?: string;
    content?: string;
    tag?: NoteTag;
  };
  serverErrors?: Record<string, string>;
  cancelHref?: string;
}

export default function NoteForm({
  initialValues,
  cancelHref = '/notes/filter/All',
  serverErrors,
}: NoteFormProps) {
  const router = useRouter();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (noteData: NewNoteData) => createNote(noteData),
    onSuccess: () => {
      router.push('/notes/filter/All');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData) as unknown as NewNoteData;
    mutate(values);
  };
  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={initialValues?.title ?? ''}
          required
          minLength={3}
          maxLength={50}
        />
        {serverErrors?.title && (
          <span className={css.error}>{serverErrors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={initialValues?.content ?? ''}
          maxLength={500}
        />
        {serverErrors?.content && (
          <span className={css.error}>{serverErrors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={initialValues?.tag ?? 'Todo'}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {serverErrors?.tag && (
          <span className={css.error}>{serverErrors.tag}</span>
        )}
      </div>

      <div className={css.actions}>
        <a className={css.cancelButton} href={cancelHref}>
          Cancel
        </a>
        <button type="submit" className={css.submitButton}>
          {isPending ? 'Creating note...' : 'Create note'}
        </button>
      </div>
      {error && <p className={css.error}>Failed ot create new note</p>}
    </form>
  );
}
