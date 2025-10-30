import React, { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteForm handles creating and editing notes.
 * Props:
 * - initialNote: { id?, title, content } | null
 * - onCancel: () => void
 * - onSubmit: (payload) => Promise<void> | void
 */
export default function NoteForm({ initialNote, onCancel, onSubmit }) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialNote?.title || '');
    setContent(initialNote?.content || '');
  }, [initialNote]);

  const isEdit = Boolean(initialNote?.id);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...(isEdit ? { id: initialNote.id } : {}),
        title: title.trim(),
        content: content.trim(),
      });
      setTitle('');
      setContent('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          placeholder="Note title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Note title"
        />
      </div>
      <div className="form-row">
        <textarea
          placeholder="Write your note..."
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          aria-label="Note content"
          required={!title.trim()}
        />
      </div>
      <div className="form-actions">
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Note' : 'Add Note'}
        </button>
        {isEdit && (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
