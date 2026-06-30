import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import CreateNote from '../components/CreateNote';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes when the page first loads
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data.notes);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (noteData) => {
    try {
      const response = await api.post('/notes', noteData);
      setNotes((prevNotes) => [response.data.note, ...prevNotes]);
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  const handleTogglePin = async (id, isPinned) => {
    try {
      const response = await api.put(`/notes/${id}`, { is_pinned: isPinned });
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? response.data.note : note))
      );
    } catch (err) {
      console.error('Failed to update note', err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-content">
        <CreateNote onAdd={handleAddNote} />

        {loading ? (
          <p>Loading notes...</p>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;