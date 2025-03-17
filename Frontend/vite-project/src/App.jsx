import React, { useState, useEffect, useContext, useMemo } from 'react';
import ForceGraph from '/src/components/ForceGraph';
import TopBar from '/src/components/TopBar';
import Explorer from '/src/components/Explorer';
import ToolBar from '/src/components/ToolBar';
import { MindmapProvider, MindmapContext } from '/src/components/Context';
import { generateNewNodeId } from './utils/generate_node_id';
import { convertMindmapToGraph } from './utils/convertMindmap';
import { addNodeToCurrentMap } from './utils/addNodeToCurrentMap';
import axios from 'axios';
import ForceGraphTest from './components/ForceGraphTest';


const App = () => {
  //Global States
  const { isLoggedIn, setisLoggedIn, currentmap, setCurrentMap, mindmaps, setMindmaps, selectedMindmap, selectedNode } = useContext(MindmapContext);
  
  // Local State für Graph-Daten
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  //Variablen
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  //Funktion um updatedcurrentmap ans backend zu schicken
  async function updateMindmapData(mindmapId, newData, token) {
    try {
        const response = await axios.patch(
            backendUrl + `/mindmaps/${mindmapId}/data`,
            { data: newData },  // Payload mit dem `data`-Feld
            {
                headers: {
                    "Authorization": `Bearer ${token}`,  // Token für Auth
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Mindmap aktualisiert:", response.data);
        return response.data;
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Mindmap:", error.response?.data || error);
        throw error;
    }
  }

  // Funktion, um eine neue Node hinzuzufügen
  function addNode(parentId) {
    const nodes = graphData.nodes;
    const links = graphData.links;

    // Generiere die ID für die neue Node basierend auf der Parent-ID
    const newNodeId = generateNewNodeId(nodes, parentId);

    // Erstelle die neue Node
    const newNode = {
      id: newNodeId,
      label: "Neue Node" + newNodeId,
      x: nodes.find(node => node.id === parentId)?.x + 30,  // Beispiel für Position
      y: nodes.find(node => node.id === parentId)?.y + 30
    };

    // Erstelle den neuen Link zur Parent-Node
    const newLink = {
      source: parentId,
      target: newNode.id
    };

    // Aktualisiere den Graphen mit der neuen Node und dem neuen Link
    setGraphData(prevGraphData => ({
      nodes: [...prevGraphData.nodes, newNode],
      links: [...prevGraphData.links, newLink]
    }));

    const jsonNode = {
      "id": newNodeId,
      "text": newNode.label
    }
    // Node zu currentmap hinzufuegen 
    const updatedMap = addNodeToCurrentMap(currentmap, parentId, jsonNode);
    console.log('UpdatedMp' + JSON.stringify(updatedMap, null, 2));
    setCurrentMap(updatedMap);

    // Jetzt die Mindmap in der Liste aktualisieren
    // Gehe das mindmaps-Array durch und aktualisiere nur die inneren Daten der Map (z.B. `children` oder `currentMap`)
    setMindmaps(prevMindmaps => {
      return prevMindmaps.map(map => {
          // Überprüfe, ob wir die richtige Map (z.B. anhand der ID) finden
          if (map.id === selectedMindmap) {
              // Nur die Daten innerhalb der Map aktualisieren (z.B. `children`, `currentMap`-Daten)
              return {
                  ...map, // Bewahre die anderen Metadaten wie `ownerId`, `id` etc.
                  data: updatedMap // Hier ändern wir nur den "Daten"-Teil der Map (z.B. `currentMap`, `children`)
              };
          }
          return map; // Unveränderte Maps bleiben gleich
      });
    });
    console.log('UpdatedMindmapsArray' + JSON.stringify(mindmaps, null, 2));

    // Daten ans Backend schicken
    const token = localStorage.getItem("token");
    updateMindmapData(selectedMindmap, updatedMap, token);
  }

  // useMemo: Verhindert unnötige Neuberechnung der Nodes/Links
  const graphDataMemo = useMemo(() => {
    if (!currentmap) return { nodes: [], links: [] };
    console.log("Konvertiere Mindmap:", currentmap);
    return convertMindmapToGraph(currentmap);
  }, [currentmap]); // Nur neu berechnen, wenn selectedMindmap sich ändert

  // Token vorhanden?
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setisLoggedIn(true);
    }
  }, []);

  // Effektiv den berechneten Graphen in den lokalen Zustand übernehmen
  useEffect(() => {
    if (graphDataMemo.nodes.length > 0 || graphDataMemo.links.length > 0) {
      setGraphData(graphDataMemo);
    }
  }, [graphDataMemo]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* 🔹 TOPBAR */}
      <TopBar />
      
      <div className="flex flex-1">
        {/* 🔹 SIDEBAR */}
        <Explorer />

        {/* 🔹 GRAPH-BEREICH */}
        <div className="flex flex-1 h-screen bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative">
          <ToolBar addNode={addNode} />
          {selectedMindmap && isLoggedIn && <ForceGraphTest nodes={graphData.nodes} links={graphData.links} />}
        </div>
      </div>
    </div>
  );
};

export default App;
