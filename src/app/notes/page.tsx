'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const NotesPage = () => {
  const router = useRouter();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      router.push('/login'); // Redirect to login if not logged in
    } else {
      // Fetch user notes from the server or localStorage
      // For now, assume notes are hardcoded
      setNotes([{ title: 'First Note', content: 'This is the first note.' }]);
    }
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        <ul>
          {notes.map((note, index) => (
            <li key={index} className="border p-4 mb-4">
              <h2 className="text-xl font-bold">{note.title}</h2>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesPage;
