import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NotesList shows a list of notes with edit and delete actions.
 * Props:
 * - notes: Array<{id, title, content, updated_at?}>
 * - onEdit: function(note) -> void
 * - onDelete: function(id) -> void
 */
export default function NotesList({ notes, onEdit, onDelete }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <div className="empty-emoji" aria-hidden>📝</div>
          <h3>No notes yet</h3>
          <p>Create your first note using the form above.</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="notes-list" aria-live="polite">
      {notes.map((n) => (
        <li key={n.id} className="note-card">
          <div className="note-header">
            <h4 className="note-title">{n.title || 'Untitled'}</h4>
            <div className="note-actions">
              <button
                className="btn btn-secondary"
                onClick={() => onEdit(n)}
                aria-label={`Edit note ${n.title || n.id}`}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(n.id)}
                aria-label={`Delete note ${n.title || n.id}`}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
          <p className="note-content">{n.content}</p>
          {n.updated_at ? (
            <div className="note-meta">Updated: {new Date(n.updated_at).toLocaleString()}</div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
