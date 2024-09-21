'use client'
import { useEffect, useState } from "react";

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

export function ModalComponent({ todo, onSave }: { todo: TODO, onSave: (updatedTodo: TODO) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(todo.name);
  const [id, setid] = useState(todo.id);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Handle save and update
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/todos/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name , id }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        onSave(updatedTodo);  // Update parent component state
        closeModal();  // Close modal after saving
      } else {
        console.error('Error updating todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="font-medium text-blue-600 hover:underline"
        type="button"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full">
          <div className="relative p-4 w-full max-w-2xl">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold">Edit Todo</h3>
                <button onClick={closeModal} className="text-gray-400 hover:bg-gray-200 rounded-lg w-8 h-8 z-index-99">
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 1" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Todo Name"
                  required
                  type="text"
                  className="block w-full p-4 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center p-4 border-t border-gray-200">
                <button onClick={handleSave} className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2.5">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}