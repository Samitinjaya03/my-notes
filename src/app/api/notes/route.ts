import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { connectDB } from '@/libs/mongodb';
import Note from '@/models/Note';

export async function GET(req: NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user?.email;
    const notes = await Note.find({
        $or: [{ owners: userEmail }, { sharedWith: userEmail }],
    });

    return NextResponse.json(notes, { status: 200 });
}

export async function POST(req: NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await req.json();
    const userEmail = session.user?.email;

    const newNote = new Note({
        title,
        content,
        owners: [userEmail],
        sharedWith: [],
    });

    await newNote.save();
    return NextResponse.json(newNote, { status: 201 });
}

export async function PUT(req: NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, updatedTitle, updatedContent } = await req.json();
    const userEmail = session.user?.email;

    const updatedNote = await Note.findOneAndUpdate(
        { _id: id, owners: userEmail },
        { title: updatedTitle, content: updatedContent },
        { new: true }
    );

    if (!updatedNote) {
        return NextResponse.json({ error: 'You do not have permission to update this note' }, { status: 403 });
    }

    return NextResponse.json(updatedNote, { status: 200 });
}

export async function DELETE(req: NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get('noteId');
    const userEmail = session.user?.email;

    const deletedNote = await Note.findOneAndDelete({ _id: noteId, owners: userEmail });
    if (!deletedNote) {
        return NextResponse.json({ error: 'You do not have permission to delete this note' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
}
