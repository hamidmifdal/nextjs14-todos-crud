import { useState } from "react";
interface TODO {
    name: string;
    createdAt: string;
    id: string;
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