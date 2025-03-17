import React, { useState, useEffect, useContext} from "react";
import axios from "axios";
import { MindmapContext } from "/src/components/Context";
import { CirclePlus, Trash, Check, X} from "lucide-react";
import DeleteModal from "/src/components/DeleteModal";
import { Snackbar, Alert } from "@mui/material";

const Explorer = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { isLoggedIn, setisLoggedIn, mindmaps, setMindmaps, currentmap, setCurrentMap, selectedMindmap, setSelectedMindmap, darkMode } = useContext(MindmapContext);

  const [mindmapToDelete, setMindmapToDelete] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newMindmapTitle, setNewMindmapTitle] = useState("");

  //snackbaralerts
  const [openbar, setOpenBar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success'); // 'success' oder 'error'

  const handleAddingClick = () => {
    if (isLoggedIn) {
      setIsAdding(true);
    }
  };
  
  const handleSelect = (id) => {
    setSelectedMindmap(id);
    console.log("Ausgewählte ID:", id);
    console.log('Mindmaps:', mindmaps);

    const map = mindmaps.find(mindmap => mindmap.id === id);
    
    if (!map) {
        console.warn("Mindmap nicht gefunden für ID:", id);
        return;
    }

    console.log("Gefundene Mindmap:", map);

    setCurrentMap(map.data);
    console.log("Gesetzte CurrentMap:", map.data);
  };

  const addMindmap = async () => {
    const token = localStorage.getItem('token');

    if (!newMindmapTitle.trim()) return;
    if (!token) return;

    const newMindmap = {
      owner_id: 0,
      data: { "id": "root",
              "text": newMindmapTitle,
              "children": [] },
      id: "temp-" + Date.now(),
      title: newMindmapTitle,
    };

    setMindmaps((prev) => [...prev, newMindmap]);
    setIsAdding(false);
    setNewMindmapTitle("");

    try {
      // 🔹 An Backend senden
      const response = await axios.post(backendUrl + "/mindmaps/",
        {
          title: newMindmap.title,
          data: newMindmap.data,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      newMindmap.id = response.data.id;
      setAlertMessage('Mindmap created: '+ newMindmapTitle);
      setAlertSeverity('success');
      setOpenBar(true);
    } catch (error) {
      console.error("Error creating mindmap:", error);
      setAlertMessage('Failed to create Mindmap');
      setAlertSeverity('error');
      setOpenBar(true);
    }
  };



  const deleteMindmap = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!mindmapToDelete) return;

    try {
      await axios.delete(backendUrl + "/mindmaps/" + mindmapToDelete,
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      setMindmaps((prev) => prev.filter((m) => m.id !== mindmapToDelete));
      setAlertMessage('Mindmap deleted');
      setAlertSeverity('success');
      setOpenBar(true);
    } catch (error) {
      console.error("Fehler beim Loeschen", error);
      setAlertMessage('Failed to delete Mindmap');
      setAlertSeverity('error');
      setOpenBar(true);
    } finally {
      setMindmapToDelete(null);
    }
  };

  return (
    <div className="flex flex-col min-w-[250px] h-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 p-1 text-gray-900 dark:text-amber-50">
      <ul>
        {mindmaps.map((mindmap) => (
          <li 
          key={mindmap.id}
          className={`flex items-center justify-between p-1 rounded mb-1 bg-neutral-300 dark:bg-neutral-700 cursor-pointer hover:bg-neutral-400 dark:hover:bg-neutral-600 
            ${selectedMindmap === mindmap.id ? "border-2 border-blue-500 bg-gray-200 dark:bg-gray-800" : "bg-gray-200 dark:bg-gray-800"}`}
          onClick={() => handleSelect(mindmap.id)}
        >
          <span>{mindmap.title} ({mindmap.id})</span>
          <Trash 
            size={16} 
            className="text-gray-600 dark:text-gray-400 hover:text-red-600 opacity-30 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Verhindert, dass der `onClick` des `li` ausgelöst wird
              setMindmapToDelete(mindmap.id);
            }}
          />
          {mindmapToDelete && <DeleteModal onConfirm={deleteMindmap} onCancel={() => setMindmapToDelete(null)} />}
        </li>
        ))}
      </ul>
      {isLoggedIn && isAdding ? (
          // Eingabefeld wird angezeigt, wenn isAdding true ist
          <li className="flex items-center p-1 bg-neutral-300 dark:bg-neutral-700 rounded">
            <input
              type="text"
              placeholder="Mindmap Name..."
              value={newMindmapTitle}
              onChange={(e) => setNewMindmapTitle(e.target.value)}
              className="flex-1 p-1 bg-neutral-400 dark:bg-neutral-600 text-gray-900 dark:text-white rounded"
            />
            <button onClick={addMindmap} className="ml-1.5 text-green-400 hover:text-green-600 cursor-pointer">
              <Check size={20} />
            </button>
            <button onClick={() => setIsAdding(false)} className="ml-1.5 text-red-400 hover:text-red-600 cursor-pointer">
              <X size={20} />
            </button>
          </li>
        ) : (
          // Plus-Button wird angezeigt, wenn isAdding false ist
          
        <button className="p-0.5 rounded mb-1 flex items-center justify-center cursor-pointer bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
        onClick={handleAddingClick}>
          <CirclePlus/>
        </button>
        )}
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={openbar} autoHideDuration={6000} onClose={() => setOpenBar(false)}>
           <Alert onClose={() => setOpenBar(false)} severity={alertSeverity} sx={{ width: '100%' }}>
             {alertMessage}
           </Alert>
        </Snackbar>
    </div>
  );
};

export default Explorer;
