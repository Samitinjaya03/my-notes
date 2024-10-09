import { NextRequest, NextResponse } from 'next/server';
import Note from '@/models/Note';
import { connectDB } from '@/libs/mongodb';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { noteId, email } = await req.json();

    if (!noteId || !email) {
      return NextResponse.json({ message: 'Note ID and email are required' }, { status: 400 });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    if (!note.sharedWith.includes(email)) {
      note.sharedWith.push(email);
      await note.save();
    }

    return NextResponse.json({ message: 'Note shared successfully', note });
  } catch (error) {
    console.error('Error sharing note:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
