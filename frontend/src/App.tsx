import './App.css'
import axios from 'axios';
import { useState, useEffect } from "react";

function App() {
    const [todos, setTodos] = useState([])
    const [task, setTask] = useState('');
    const [actif, setActif] = useState(true);

    useEffect(() => {
        fetchTodos()
    }, []);

    const addTodo = async () => {
        if (task.trim()) {
            await axios.post('http://localhost:3001/todos', {task, actif});
            setTask('');
            setActif(true)
            fetchTodos()
        }


    }


    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:3001/todos');
        setTodos(response.data)
    }

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:3001/todos/${id}`);
        fetchTodos()
    }



    return (
    <>

        <input type="text" value={task} onChange={(e => setTask(e.target.value))} />
        <label>
<input type="checkbox" checked={actif} onChange={(e => setActif(e.target.value))} />
        </label>
        <button onClick={addTodo}>Ajouter</button>
 <ul>
     {todos.map((todo) => (
         <li key={todo.id}>
         {todo.task} <button onClick={() => deleteTodo(todo.id)}> Supprimer</button>
         </li>
     ))}

 </ul>
    </>
  )
}

export default App
