import { useState } from "react";

const ManipulateDOM = () => {
  const [elements, setElements] = useState<{ id: number; color: string }[]>([]);

  const getRandomColor = () => {
    const colors = ["red", "yellow", "blue", "green", "teal", "orange"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addElement = () => {
    const newElement = {
      id: Date.now(),
      color: getRandomColor(),
    };
    setElements([...elements, newElement]);
  };

  const clearElements = () => {
    setElements([]);
  };

  const removeElement = (id: number) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  return (
    <div className="flex flex-col items-center p-5">
      <h2 className="text-3xl font-bold mb-4">Manipulate DOM</h2>
      <div className="space-x-2 mb-4">
        <button
          onClick={addElement}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add element to DOM
        </button>
        <button
          onClick={clearElements}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Clear DOM
        </button>
      </div>
      <div className="w-full max-w-lg">
        {elements.map((el) => (
          <div
            key={el.id}
            onClick={() => removeElement(el.id)}
            className={`p-4 mb-2 text-white flex items-center justify-between cursor-pointer rounded`}
            style={{ backgroundColor: el.color }}
          >
            <span>Element</span>
            <span>👤</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManipulateDOM;
