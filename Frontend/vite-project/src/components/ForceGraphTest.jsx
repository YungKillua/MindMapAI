import React, { useEffect, useRef, useState, useContext } from "react";
import * as d3 from "d3";
import { MindmapContext } from "/src/components/Context";

const ForceGraphTest = ({ nodes, links }) => {
  //Global States
  const {selectedNode, setSelectedNode, animationEnabled} = useContext(MindmapContext);
  //Local States
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const gRef = useRef(null);
  const [forceStrength, setForceStrength] = useState(-300);

  const isDarkMode = document.documentElement.classList.contains("dark");

  const linkColor = isDarkMode ? "#888" : "#ccc";  // Links heller im Dark Mode
  const nodeColor = isDarkMode ? "#333" : "#f0f0f0";  // Nodes dunkler im Dark Mode
  const textColor = isDarkMode ? "#FFFFFF" : "#FFFFFF";  // Weißer Text in Dark Mode
  const selectednodeColor = isDarkMode ? "#f0f0f0" : "#333";  // Helles Highlight im Dark Mode

  useEffect(() => {
    console.log("Nodes prop:", nodes);
    console.log("Links prop:", links);
    // Setze sel node auf null bei map wechsel
    setSelectedNode(null);
    // Setze die Simulation nur, wenn Nodes und Links vorhanden sind
    if (nodes.length === 0 && links.length === 0) {
      return; // Beende die Ausführung, wenn keine Daten vorhanden sind
    }

    // Breite und Höhe des übergeordneten Containers ermitteln
    const width = svgRef.current.parentElement.clientWidth;
    const height = svgRef.current.parentElement.clientHeight;

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    // Falls das g-Element noch nicht existiert, erstelle es einmal
    if (!gRef.current) {
      gRef.current = svg.append("g");
      
      svg.call(
        d3.zoom()
          .scaleExtent([0.5, 5])
          .on("zoom", (event) => {
            gRef.current.attr("transform", event.transform);
          })
      );
    }

    svg.on("click", (event) => {
      if (event.target === svgRef.current) {
        setSelectedNode(null); // Setze selectedNode auf null, wenn der Hintergrund angeklickt wird
      }
    });

    const g = gRef.current;

    // Falls die Simulation noch nicht existiert, erstelle sie
    if (!simulationRef.current) {
      simulationRef.current = d3
        .forceSimulation()
        .force("link", d3.forceLink().id((d) => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(forceStrength))
        .force("center", d3.forceCenter(width / 4, height / 3));
    }

    const simulation = simulationRef.current;
    
    // Alle Links zurücksetzen
    simulation.force("link").links([]);
    
    // Erstelle eine Kopie der Nodes für die Verwaltung
    const nodesMap = {};
    nodes.forEach(node => {
      nodesMap[node.id] = { ...node };
    });

    // Erstelle eine Kopie der Links für die Verwaltung und normalisiere die Referenzen
    const linksData = links.map(link => {
      return {
        sourceId: typeof link.source === 'object' ? link.source.id : link.source,
        targetId: typeof link.target === 'object' ? link.target.id : link.target
      };
    });

    let currentNodes = [];
    let currentLinks = [];

    const updateGraph = () => {
      // Links aktualisieren mit Objektreferenzen
      const properLinks = currentLinks.map(link => ({
        source: currentNodes.find(n => n.id === link.sourceId),
        target: currentNodes.find(n => n.id === link.targetId)
      })).filter(link => link.source && link.target); // Nur gültige Links behalten
      
      console.log("Aktualisiere Graph mit:", currentNodes.length, "Nodes und", properLinks.length, "Links");
      
      // Links updaten
      const link = g.selectAll(".link")
        .data(properLinks, d => `${d.source.id}-${d.target.id}`)
        .join(
          enter => enter.append("line")
            .attr("class", "link")
            .attr("stroke", linkColor)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 1),
          update => update,
          exit => exit.remove()
        );

      // Links unten 
      link.lower();

      // Nodes updaten
      const node = g.selectAll(".node")
        .data(currentNodes, d => d.id)
        .join(
          enter => enter.append("circle")
            .attr("class", "node")
            .attr("r", 8)
            .attr("fill", d => (d.id === selectedNode ? selectednodeColor : nodeColor))
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 1)
            .selection()
            .on("click", (event, d) => {
              setSelectedNode(d.id);
            })
            .call(
              d3.drag()
                .on("start", (event, d) => {
                  if (!event.active) simulation.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                  setSelectedNode(d.id);
                })
                .on("drag", (event, d) => {
                  d.fx = event.x;
                  d.fy = event.y;
                })
                .on("end", (event, d) => {
                  if (!event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                })
            ),
          update => update.attr("fill", d => (d.id === selectedNode ? selectednodeColor : nodeColor)),
          exit => exit.remove()
        );
    
      // Labels updaten
      const labels = g.selectAll(".label")
        .data(currentNodes, d => d.id)
        .join(
          enter => enter.append("text")
            .attr("class", "label")
            .attr("fill", textColor)
            .attr("text-anchor", "middle")
            .attr("dy", 40)
            .attr("font-size", "10px")
            .text(d => d.label)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 1),
          update => update,
          exit => exit.remove()
        );

      // Simulation mit neuen Daten aktualisieren
      simulation.nodes(currentNodes);
      simulation.force("link").links(properLinks);
      simulation.alpha(1).restart();

      // Positionen bei jedem Tick aktualisieren
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
    
        node.attr("cx", d => d.x).attr("cy", d => d.y);
    
        labels.attr("x", d => d.x).attr("y", d => d.y - 15);
      });
    };

    // Füge schrittweise Nodes und deren verknüpfte Links hinzu
    const addNodeStepByStep = (index) => {
      if (index >= nodes.length) return;
      
      // Füge den aktuellen Node hinzu
      const newNode = nodes[index];
      currentNodes.push(newNode);
      
      // Finde alle Links, die mit diesem Node verbunden sind
      // und bei denen der andere Node bereits im Graphen ist
      linksData.forEach(link => {
        if (link.sourceId === newNode.id) {
          // Prüfe, ob der Ziel-Node bereits existiert
          if (currentNodes.some(node => node.id === link.targetId)) {
            currentLinks.push(link);
          }
        } else if (link.targetId === newNode.id) {
          // Prüfe, ob der Quell-Node bereits existiert
          if (currentNodes.some(node => node.id === link.sourceId)) {
            currentLinks.push(link);
          }
        }
      });
      
      // Aktualisiere die Anzeige
      updateGraph();
      
      // Nächsten Node mit Verzögerung hinzufügen
      setTimeout(() => addNodeStepByStep(index + 1), 300);
    };
    
    // Starte je nach Animation-Modus
    if (!animationEnabled) {
      // Sofort alle Nodes und Links hinzufügen
      currentNodes = [...nodes];
      currentLinks = linksData;
      updateGraph();
    } else {
      // Starte schrittweise Animation
      setTimeout(() => addNodeStepByStep(0), 500);
    }

    return () => {
      // Simulation resetten aber nicht entfernen
      simulation.stop();
    };
  }, [nodes, links, animationEnabled, forceStrength]);

  useEffect(() => {
    d3.selectAll(".node")
      .attr("fill", (d) => (d.id === selectedNode ? selectednodeColor : nodeColor));
  }, [selectedNode]);
  

  return <svg className="map-bg" ref={svgRef}></svg>;
};

export default ForceGraphTest;