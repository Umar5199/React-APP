import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    // Update the UI immediately
    const newTodoItem = { text: newTodo, completed: false }; // Create a new todo item
    setTodos(prevTodos => [...prevTodos, newTodoItem]); // Append the new todo item to the todos array
    setNewTodo(''); // Clear the input field

    // Send the request to add the todo item on the server
    try {
      const response = await axios.post('/api/todos', { text: newTodo });
      // If you want to update the UI with the server response, uncomment the following lines
      // const newTodoItem = response.data; // Newly added todo item from server
      // setTodos([...todos, newTodoItem]); // Append the new todo item to the todos array
      // setNewTodo(''); // Clear the input field
    } catch (error) {
      console.error('Error adding todo:', error);
      // Revert the UI changes if there's an error
      setTodos(prevTodos => prevTodos.filter(todo => todo !== newTodoItem)); // Remove the newly added todo item
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id)); // Filter out the deleted todo
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find(todo => todo._id === id);
      await axios.put(`/api/todos/${id}`, { completed: !todo.completed });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="todo-list-container">
      <h1>Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Write Task you TO"
        />
        <button className="add-button" onClick={addTodo}>ADD</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleComplete(todo._id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo._id)}>DELETE</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
