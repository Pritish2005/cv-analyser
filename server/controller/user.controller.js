const User = require('../model/user.model.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userId: uuidv4(),
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    const { password: pw, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.userId},
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    const { password: pw, ...userWithoutPassword } = user.toObject();

    return res.json({ token, user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports={register,login}