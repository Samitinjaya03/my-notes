// src/pages/api/auth/signup.js
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Check if the user already exists
    await connectDB();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await user.save();
      res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
