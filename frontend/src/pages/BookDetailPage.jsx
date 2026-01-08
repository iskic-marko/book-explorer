import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBook } from '../hooks';
import { useAuth } from '../hooks';
import { noteService } from '../services/api';
import BookCover from '../components/BookCover';

export default function BookDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { book, isLoading, error } = useBook(id);

  const [notes, setNotes] = useState([]);
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (book?.user_notes) {
      setNotes(book.user_notes);
    }
  }, [book?.user_notes]);

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setNoteLoading(true);
    setNoteError('');
    try {
      const response = await noteService.createNote({ book: id, content: newNote });
      setNotes([response.data, ...notes]);
      setNewNote('');
    } catch {
      setNoteError('Failed to add note.');
    } finally {
      setNoteLoading(false);
    }
  };

  const updateNote = async (noteId) => {
    if (!editContent.trim()) return;

    setNoteLoading(true);
    try {
      const response = await noteService.updateNote(noteId, { content: editContent });
      setNotes(notes.map((n) => (n.id === noteId ? response.data : n)));
      setEditingId(null);
      setEditContent('');
    } catch {
      setNoteError('Failed to update note.');
    } finally {
      setNoteLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    setNoteLoading(true);
    try {
      await noteService.deleteNote(noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch {
      setNoteError('Failed to delete note.');
    } finally {
      setNoteLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading book details...</div>;
  if (error && !book) return <div className="error-message">{error}</div>;
  if (!book) return <div className="error-message">Book not found.</div>;

  return (
    <div className="book-detail-page">
      <Link to="/" className="back-link">&larr; Back to Books</Link>

      <div className="book-detail-content">
        <BookCover src={book.cover_image_url} alt={book.title} className="large" />

        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>

          <div className="book-meta">
            {book.genre && (
              <span className="meta-item"><strong>Genre:</strong> {book.genre}</span>
            )}
            {book.published_date && (
              <span className="meta-item">
                <strong>Published:</strong> {new Date(book.published_date).toLocaleDateString()}
              </span>
            )}
            {book.page_count && (
              <span className="meta-item"><strong>Pages:</strong> {book.page_count}</span>
            )}
            {book.isbn && (
              <span className="meta-item"><strong>ISBN:</strong> {book.isbn}</span>
            )}
          </div>

          {book.description && (
            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="notes-section">
        <h2>My Notes</h2>
        {noteError && <div className="error-message small">{noteError}</div>}

        {user ? (
          <>
            <form onSubmit={addNote} className="note-form">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a personal note about this book..."
                rows={3}
              />
              <button type="submit" className="btn btn-primary" disabled={noteLoading} data-testid="add-note-submit">
                {noteLoading ? 'Adding...' : 'Add Note'}
              </button>
            </form>

            {notes.length === 0 ? (
              <p className="no-notes">You haven't added any notes for this book yet.</p>
            ) : (
              <div className="notes-list">
                {notes.map((note) => (
                  <div key={note.id} className="note-item">
                    {editingId === note.id ? (
                      <div className="note-edit">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                        />
                        <div className="note-actions">
                          <button
                            onClick={() => updateNote(note.id)}
                            className="btn btn-primary btn-small"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn btn-secondary btn-small"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="note-content">{note.content}</p>
                        <div className="note-footer">
                          <span className="note-date">
                            {new Date(note.created_at).toLocaleString()}
                          </span>
                          <div className="note-actions">
                            <button
                              onClick={() => {
                                setEditingId(note.id);
                                setEditContent(note.content);
                              }}
                              className="btn btn-secondary btn-small"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="btn btn-danger btn-small"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="login-prompt">
            <Link to="/login">Login</Link> to add personal notes to this book.
          </p>
        )}
      </div>
    </div>
  );
}
