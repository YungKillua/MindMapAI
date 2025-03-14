import React, {useState, useEffect, useContext, useMemo} from 'react';
import ForceGraph from '/src/components/ForceGraph';
import TopBar from '/src/components/TopBar';
import Explorer from '/src/components/Explorer';
import TooolBar from '/src/components/ToolBar';
import { MindmapProvider, MindmapContext } from '/src/components/Context';




const App = () => {

  const {isLoggedIn, setisLoggedIn, currentmap, mindmaps, selectedMindmap } = useContext(MindmapContext);

  const [nodes, setNodes] = useState ([]);
  const [links, setLinks] = useState ([]);

  

    // useMemo: Verhindert unnötige Neuberechnung der Nodes/Links
    const graphData = useMemo(() => {
      if (!currentmap) return { nodes: [], links: [] };
      console.log("Konvertiere Mindmap:", currentmap);
      return convertMindmapToGraph(currentmap);
    }, [currentmap]); // Nur neu berechnen, wenn selectedMindmap sich ändert

 //Token vorhanden?
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setisLoggedIn(true);
    }
  }, []);

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
          {/* 🔹 TOPBAR */}

          <TopBar/>
          
          <div className= "flex flex-1">
            {/* 🔹 SIDEBAR */}
            <Explorer/>

            {/* 🔹 GRAPH-BEREICH */}
            <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 overflow-hidden relative">
              <TooolBar/>
              {selectedMindmap && isLoggedIn && <ForceGraph nodes={graphData.nodes} links={graphData.links} />}
            </div>
          </div>
        </div>
    );
  };
  
  const convertMindmapToGraph = (mindmap) => {
    let nodes = [];
    let links = [];
  
    const traverse = (node, parent = null) => {
      nodes.push({ id: node.id, label: node.text });
  
      if (parent) {
        links.push({ source: parent.id, target: node.id });
      }
  
      if (node.children) {
        node.children.forEach((child) => traverse(child, node));
      }
    };
  
    traverse(mindmap);
    return { nodes, links };
  };

export default App;
