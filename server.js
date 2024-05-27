const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const mongoURI = 'mongodb+srv://umarashfaq518:E7nKHZ9cZbhmPrGz@todolist.2jub0oh.mongodb.net/Todolist';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const todoSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/', (req, res) => {
  res.send('Hello, this is the TodoList API!');
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Error fetching todos' });
  }
});

// Get a specific todo by its ID
app.get('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Error fetching todo' });
  }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    console.error('Todo text is required');
    return res.status(400).json({ error: 'Todo text is required' });
  }
  try {
    const newTodo = new Todo({ text });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error adding todo:', error.message);
    res.status(500).json({ error: 'Error adding todo' });
  }
});

// Update an existing todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error.message);
    res.status(500).json({ error: 'Error updating todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Todo.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    res.status(500).json({ error: 'Error deleting todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
