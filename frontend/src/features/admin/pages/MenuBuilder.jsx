import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaExpandArrowsAlt,
  FaCheck,
  FaPlus,
  FaSyncAlt,
} from "react-icons/fa";

const MenuBuilder = () => {
  const [mainMenu, setMainMenu] = useState([]);
  const [premadeMenu, setPremadeMenu] = useState([]);
  const [newItem, setNewItem] = useState({
    text: "",
    url: "",
    target: "_self",
  });
  const [message, setMessage] = useState("");

  // ✅ Fetch menu data on load
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/menu-builder");
        setMainMenu(res.data.mainMenu || []);
        setPremadeMenu(res.data.premadeMenu || []);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenus();
  }, []);

  // ✅ Add new menu item using POST
  const handleAddMenu = async () => {
    if (!newItem.text || !newItem.url) {
      alert("Text and URL are required");
      return;
    }

    const userId = localStorage.getItem("userId");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/menu-builder/add",
        {
          type: "mainMenu",
          item: newItem,
          userId,
        }
      );

      setMainMenu(res.data.data.mainMenu);
      setNewItem({ text: "", url: "", target: "_self" });
      setMessage("✅ Menu item added!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add menu item");
    }
  };

  // ✅ Update full menu using PUT
  const handleUpdateMenu = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Missing userId in localStorage. Please set it.");
      return;
    }

    try {
      const res = await axios.put("http://localhost:8000/api/menu-builder", {
        mainMenu,
        premadeMenu,
        userId,
      });
console.log(res.data);
      setMessage("✅ Menu updated!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update menu");
    }
  };

  // 🗑️ Remove item from mainMenu
  const handleDeleteItem = (index) => {
    const updated = [...mainMenu];
    updated.splice(index, 1);
    setMainMenu(updated);
  };

  return (
    <div className="p-6 w-full mx-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Menu Builder</h2>
        <div className="flex gap-2">
          <button
            onClick={handleUpdateMenu}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Main Menu
          </button>
          <select className="border border-gray-300 rounded px-2 py-1">
            <option>English</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* 🆕 Add/Edit Form */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-4">Add/Edit/Update Area</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Text</label>
              <input
                type="text"
                value={newItem.text}
                onChange={(e) =>
                  setNewItem({ ...newItem, text: e.target.value })
                }
                placeholder="Text"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="text"
                value={newItem.url}
                onChange={(e) =>
                  setNewItem({ ...newItem, url: e.target.value })
                }
                placeholder="URL"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target</label>
              <select
                value={newItem.target}
                onChange={(e) =>
                  setNewItem({ ...newItem, target: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="_self">_self</option>
                <option value="_blank">_blank</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleUpdateMenu}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded flex items-center gap-2"
              >
                <FaSyncAlt /> Update Menu
              </button>
              <button
                onClick={handleAddMenu}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2"
              >
                <FaPlus /> Add Menu
              </button>
            </div>
          </div>
        </div>

        {/* 📋 Main Menu */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-4">Main Menu Area</h3>
          {mainMenu.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border rounded px-3 py-2 mb-2"
            >
              <span>{item.text}</span>
              <div className="flex gap-1 text-white text-sm">
                <button
                  className="bg-gray-600 px-2 py-1 rounded"
                  title="Move Up"
                >
                  <FaArrowUp />
                </button>
                <button
                  className="bg-gray-600 px-2 py-1 rounded"
                  title="Move Down"
                >
                  <FaArrowDown />
                </button>
                <button
                  className="bg-blue-500 px-2 py-1 rounded"
                  title="Expand"
                >
                  <FaExpandArrowsAlt />
                </button>
                <button
                  className="bg-green-500 px-2 py-1 rounded"
                  title="Check"
                >
                  <FaCheck />
                </button>
                <button className="bg-pink-500 px-2 py-1 rounded" title="Edit">
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteItem(idx)}
                  className="bg-red-500 px-2 py-1 rounded"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ⚙️ Pre-Made Menu */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-4">Pre-Made Menu Area</h3>
          {premadeMenu.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border rounded px-3 py-2 mb-2"
            >
              <span>{item.text}</span>
              <button
                onClick={() => setMainMenu([...mainMenu, item])}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                <FaPlus />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Status Message */}
      {message && (
        <p className="mt-2 text-sm text-center text-green-600">{message}</p>
      )}
    </div>
  );
};

export default MenuBuilder;
