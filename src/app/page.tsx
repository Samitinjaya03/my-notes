'use client';

import { useState } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
}

const HomePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleCreateNote = () => {
    // Logic to create a new note
    const newNote: Note = {
      id: new Date().toISOString(), // Temporary ID based on current time
      title: 'New Note',
      content: '',
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleDeleteNote = (id: string) => {
    // Logic to delete a note
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    setSelectedNote(null);
  };

  const handleSelectNote = (note: Note) => {
    // Select a note to display in the right panel
    setSelectedNote(note);
    setIsEditing(false);
  };

  const handleCloseNote = () => {
    // Close the currently open note
    setSelectedNote(null);
    setIsEditing(false);
  };

  const handleSaveNote = () => {
    // Save changes to the note
    if (selectedNote) {
      const updatedNotes = notes.map(note =>
        note.id === selectedNote.id ? selectedNote : note
      );
      setNotes(updatedNotes);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel: Notes List */}
      <div className="w-1/3 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Notes</h2>
        <button
          onClick={handleCreateNote}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Note
        </button>
        <button
          onClick={() => selectedNote && handleDeleteNote(selectedNote.id)}
          disabled={!selectedNote}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete Note
        </button>
        <ul>
          {notes.map(note => (
            <li
              key={note.id}
              className={`p-2 cursor-pointer ${selectedNote?.id === note.id ? 'bg-blue-100' : ''}`}
              onClick={() => handleSelectNote(note)}
            >
              {note.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel: Note Content */}
      <div className="w-2/3 p-4">
        {selectedNote ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{selectedNote.title}</h2>
            <textarea
              className="w-full h-64 p-2 border rounded"
              value={selectedNote.content}
              onChange={(e) => {
                if (selectedNote) {
                  setSelectedNote({ ...selectedNote, content: e.target.value });
                }
              }}
            />
            <div className="mt-4">
              <button
                onClick={handleSaveNote}
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Save Note
              </button>
              <button
                onClick={handleCloseNote}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Close Note
              </button>
            </div>
          </>
        ) : (
          <p>No note selected. Select a note from the left panel to view or edit.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
