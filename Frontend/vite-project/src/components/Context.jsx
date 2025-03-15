import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const MindmapContext = createContext(); // Context erstellen
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const MindmapProvider = ({ children }) => {
  const [selectedMindmap, setSelectedMindmap] = useState(null); // Globale Mindmap
  const [mindmaps, setMindmaps] = useState([]); // Liste der Mindmaps
  const [currentmap, setCurrentMap] = useState([]);
  const [isLoggedIn, setisLoggedIn] = useState(false);
<<<<<<< HEAD
  const [selectedNode, setSelectedNode] = useState(null);
=======
>>>>>>> 67c7627d4618095c715b3c11bb060156e0a5fefe

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  ); //Darkmode
  
    useEffect(() => {
        const fetchMindmaps = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(backendUrl + "/mindmaps/", {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setMindmaps(response.data); // Mindmaps aus der API speichern
                  localStorage.setItem("user_id", response.data[0].owner_id)
                  console.log(response.data);
                } catch (error) {
                  console.error("Fehler beim Laden der Mindmaps:", error);
                }
        };

        fetchMindmaps();
    }, [isLoggedIn]);

    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }, [darkMode]);

  return (
<<<<<<< HEAD
    <MindmapContext.Provider value={{ isLoggedIn, setisLoggedIn,
                                      currentmap, setCurrentMap,
                                      mindmaps, setMindmaps,
                                      selectedMindmap, setSelectedMindmap, 
                                      darkMode, setDarkMode,
                                      selectedNode, setSelectedNode,
                                      }}>
=======
    <MindmapContext.Provider value={{ isLoggedIn, setisLoggedIn, currentmap, setCurrentMap, mindmaps, setMindmaps, selectedMindmap, setSelectedMindmap, darkMode, setDarkMode }}>
>>>>>>> 67c7627d4618095c715b3c11bb060156e0a5fefe
      {children}
    </MindmapContext.Provider>
  );
};
