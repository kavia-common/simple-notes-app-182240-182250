const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

// PUBLIC_INTERFACE
export async function fetchNotes() {
  /** Fetch all notes from the backend API. */
  const res = await fetch(`${API_BASE}/notes`);
  if (!res.ok) {
    throw new Error(`Failed to fetch notes: ${res.status}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /** Create a new note. note = { title, content } */
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!res.ok) {
    const msg = await safeReadText(res);
    throw new Error(`Failed to create note: ${res.status} ${msg}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function updateNote(id, updates) {
  /** Update an existing note by id. updates = { title?, content? } */
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const msg = await safeReadText(res);
    throw new Error(`Failed to update note ${id}: ${res.status} ${msg}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const msg = await safeReadText(res);
    throw new Error(`Failed to delete note ${id}: ${res.status} ${msg}`);
  }
  return true;
}

async function safeReadText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
