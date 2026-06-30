import { useState } from 'react';

const CreateNote = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return; // don't submit empty notes

    onAdd({ title, content });

    // Reset form after submit
    setTitle('');
    setContent('');
  };

  return (
    <form className="create-note" onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Take a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default CreateNote;