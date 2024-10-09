"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Note {
  _id: string; // Changed from 'id' to '_id' to match MongoDB's field name
  title: string;
  content: string;
}

const Home = () => {
  const {status, data: session} = useSession();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [shareEmail, setShareEmail] = useState<string>('');

  useEffect(() => {
    const fetchNotes = async () => {
      if (!session?.user?.email) {
        console.error('User session or email not found.');
        return;
      }
  
      try {
        const response = await fetch('/api/notes');
        if (response.ok) {
          const data = await response.json();
          setNotes(
            data.filter(
              (note) =>
                note.owners.includes(session.user.email) || note.sharedWith.includes(session.user.email)
            )
          );
        } else {
          console.error('Failed to fetch notes');
        }
      } catch (error) {
        console.error('An error occurred while fetching notes:', error);
      }
    };
  
    if (status === 'authenticated') {
      fetchNotes();
    }
  }, [status, session]);
  
  

  const handleCreateNote = async () => {
    try {
      const newNoteTitle = `Note ${notes.length + 1}`; // Generates a default title like "Note 1", "Note 2", etc.
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newNoteTitle,
          content: '', // Content is initially empty
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]);
        setSelectedNote(newNote);
        setIsEditing(true);
      } else {
        console.error('Failed to create note');
      }
    } catch (error) {
      console.error('An error occurred while creating a note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    // Delete the note from the database
    const response = await fetch(`/api/notes?noteId=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const updatedNotes = notes.filter(note => note._id !== id);
      setNotes(updatedNotes);
      setSelectedNote(null);
    } else {
      console.error('Failed to delete note');
    }
  };

  const handleSaveNote = async () => {
    if (selectedNote) {
      // Update the note in the database
      const response = await fetch('/api/notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedNote._id,
          updatedTitle: selectedNote.title,
          updatedContent: selectedNote.content,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        const updatedNotes = notes.map(note =>
          note._id === updatedNote._id ? updatedNote : note
        );
        setNotes(updatedNotes);
        setIsEditing(false);
      } else {
        console.error('Failed to save note');
      }
    }
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

  // Function to handle sharing a note with another user
  const handleShareNote = async () => {
    if (!selectedNote || !shareEmail) {
      console.error('Please select a note and provide an email to share with');
      return;
    }

    try {
      const response = await fetch('/api/notes/share', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: selectedNote._id,
          email: shareEmail,
        }),
      });

      if (response.ok) {
        setShareEmail(''); // Clear the input field on success
        console.log('Note shared successfully');
      } else {
        console.error('Failed to share note');
      }
    } catch (error) {
      console.error('An error occurred while sharing the note:', error);
    }
  };

  // Function to make another user owner of that note
  const handleMakeOwner = async () => {
    if (!selectedNote || !shareEmail) {
      console.error('Please select a note and provide an email to share with');
      return;
    }

    try {
      const response = await fetch('/api/notes/makeowner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: selectedNote._id,
          email: shareEmail,
        }),
      });

      if (response.ok) {
        setShareEmail(''); // Clear the input field on success
        console.log('User made owner of this Note successfully');
      } else {
        console.error('Failed to make owner');
      }
    } catch (error) {
      console.error('An error occurred making the user owner:', error);
    }
  };

  if (status === "authenticated") {
    return (
      <div className="flex h-screen">
        {/* Left Panel: Notes List */}
        <div className="relative w-1/5 bg-gray-100 p-4 border-r overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold mb-4">Notes</h2>
            <button
              onClick={handleCreateNote}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded transition duration-150 ease hover:bg-blue-600"
            >
              Create Note
            </button>
            <button
              onClick={() => selectedNote && handleDeleteNote(selectedNote._id)}
              disabled={!selectedNote}
              className="mb-4 px-4 py-2 ml-3 bg-red-600 text-white rounded transition duration-150 ease hover:bg-red-700"
            >
              Delete Note
            </button>
            <ul>
              {notes.map(note => (
                <li
                  key={note._id}
                  className={`p-2 cursor-pointer rounded transition duration-150 ease hover:bg-blue-200 ${selectedNote?._id === note._id ? 'bg-blue-100' : ''}`}
                  onClick={() => handleSelectNote(note)}
                >
                  {note.title}
                </li>
              ))}
            </ul>
          </div>
          {selectedNote && (
            <div className="mt-4">
              <h3 className="font-bold">Share Note</h3>
              <input
                type="text"
                placeholder="Enter email to share"
                className="w-full mb-2 p-2 border rounded"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
              <button
                onClick={handleShareNote}
                className="w-full px-4 py-2 bg-lime-400 rounded-xl shadow-md shadow-gray-700 transition duration-150 ease hover:bg-lime-500"
              >
                Share
              </button>
              <button
                onClick={handleMakeOwner}
                className="w-full px-4 py-2 mt-2 bg-emerald-400 rounded-xl shadow-lg shadow-gray-700 transition duration-150 ease hover:bg-emerald-500"
              >
                Make Owner
              </button>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center p-2 mb-2">
            <button
              className="text-white text-xl py-2 px-4 bg-gray-800 rounded-lg transition duration-150 ease hover:bg-gray-700"
              onClick={() => {
                signOut();
              }}
            >
              Logout here
            </button>
          </div>
        </div>

        {/* Right Panel: Note Content */}
        <div className="w-4/5 p-4">
          {selectedNote ? (
            <>
              <h2 className="text-2xl font-bold mb-2">{selectedNote.title}</h2>
              <textarea
                className="w-full h-64 p-2 bg-yellow-50 border-2 border-gray-400 rounded-xl shadow-lg shadow-gray-800"
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
                  className="mr-2 px-4 py-2 bg-green-500 text-white rounded transition duration-150 ease hover:bg-green-600"
                >
                  Save Note
                </button>
                <button
                  onClick={handleCloseNote}
                  className="px-4 py-2 bg-gray-500 text-white rounded transition duration-150 ease hover:bg-gray-600"
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
  } else if (status === "loading") {
    return <div className="text-center text-4xl font-bold py-2 px-4">Loading...</div>;
  } else {
    router.push("/login")
  }
}

export default Home;
