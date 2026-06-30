const NoteCard = ({ note, onDelete, onTogglePin }) => {
  return (
    <div className="note-card" style={{ backgroundColor: note.color }}>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-actions">
        <button onClick={() => onTogglePin(note.id, !note.is_pinned)}>
          {note.is_pinned ? '📌 Unpin' : '📌 Pin'}
        </button>
        <button onClick={() => onDelete(note.id)}>🗑️ Delete</button>
      </div>
    </div>
  );
};

export default NoteCard;