'use client'
import { useEffect, useState } from "react";
import { ModalComponent } from "@/components/Modal/Modal";
interface TODO {
  name: string;
  createdAt: string;
  id: string;
}

export default function Home() {
  const [todos, setTodos] = useState<TODO[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('null');

  async function handleDelete(id: string) {
    try {
      await fetch('/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      const data: TODO = await response.json();
      setTodos((prevTodos) => [...prevTodos, data]);
      setName('')
      console.log('Todo created successfully:', data);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch('/api/todos');
      const all: TODO[] = await res.json();
      setTodos(all);
    };
    fetchTodos();
  }, []);
  // Update todo list after editing
  const handleUpdate = (updatedTodo: TODO) => {
    setTodos((prevTodos) => 
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container px-5 mx-auto">
        <div className=" max-w-md mx-auto mt-5">
          <label className="block mb-2 text-sm font-medium text-black dark:text-black">Add a new todo</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Todo name"
            required
            type="text"
            className="block w-full p-4 text-black border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-light-50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="flex justify-center items-center mt-5">
          <button type="submit" className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5">
            Create
          </button>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Todo Name</th>
                <th scope="col" className="px-6 py-3">Created At</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {todo.name}
                  </th>
                  <td className="px-6 py-4">{todo.createdAt}</td>
                  <td className="px-6 py-4 text-right space-x-4 flex">
                    <ModalComponent todo={todo} onSave={handleUpdate} />
                    <button onClick={() => handleDelete(todo.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
}