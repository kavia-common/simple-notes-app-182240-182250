import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import NotesList from './components/NotesList';
import NoteForm from './components/NoteForm';
import { fetchNotes, createNote, updateNote, deleteNote } from './api';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root app for the Notes UI.
   * Handles theme toggling, notes state, and CRUD actions.
   */
  const [theme, setTheme] = useState('light');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load notes on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchNotes();
        if (mounted) setNotes(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load notes.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  async function handleCreate(payload) {
    setSaving(true);
    setError('');
    try {
      const created = await createNote({ title: payload.title, content: payload.content });
      setNotes((prev) => [created, ...prev]);
    } catch (e) {
      setError(e.message || 'Failed to create note');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(payload) {
    setSaving(true);
    setError('');
    try {
      const updated = await updateNote(payload.id, { title: payload.title, content: payload.content });
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setEditing(null);
    } catch (e) {
      setError(e.message || 'Failed to update note');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setSaving(true);
    setError('');
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (editing?.id === id) setEditing(null);
    } catch (e) {
      setError(e.message || 'Failed to delete note');
    } finally {
      setSaving(false);
    }
  }

  const formNote = useMemo(() => editing, [editing]);

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <div className="container">
          <h1 className="title">Simple Notes</h1>
          <p className="subtitle">Add, edit, and delete your notes. No login required.</p>

          {error ? <div className="alert alert-error" role="alert">{error}</div> : null}
          {saving ? <div className="alert alert-info" role="status">Saving...</div> : null}

          <div className="card">
            <h2 className="card-title">{formNote ? 'Edit Note' : 'New Note'}</h2>
            <NoteForm
              initialNote={formNote}
              onCancel={() => setEditing(null)}
              onSubmit={(payload) => formNote ? handleUpdate(payload) : handleCreate(payload)}
            />
          </div>

          <div className="card">
            <h2 className="card-title">Your Notes</h2>
            {loading ? (
              <div className="skeleton-list">
                <div className="skeleton-row" />
                <div className="skeleton-row" />
                <div className="skeleton-row" />
              </div>
            ) : (
              <NotesList
                notes={notes}
                onEdit={(n) => setEditing(n)}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
