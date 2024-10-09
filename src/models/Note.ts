import mongoose, { Schema, Document, Model } from "mongoose";

interface INote extends Document {
  title: string;
  content: string;
  owners: string[]; // Array of user emails who own the note
  sharedWith: string[]; // Array of user emails with whom the note is shared
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
      default: '',
    },
    owners: {
      type: [String], // Array of emails of the owners of the note
      required: true,
    },
    sharedWith: {
      type: [String], // Array of emails of users with whom the note is shared
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;
