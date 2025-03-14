import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ForceGraph = ({ nodes, links }) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const gRef = useRef(null);
  const [forceStrength, setForceStrength] = useState(-300);
  const [selectedNode, setSelectedNode] = useState(null);

  const isDarkMode = document.documentElement.classList.contains("dark");

  const linkColor = isDarkMode ? "#888" : "#ccc";  // Links heller im Dark Mode
  const nodeColor = isDarkMode ? "#333" : "#f0f0f0";  // Nodes dunkler im Dark Mode
  const textColor = isDarkMode ? "#FFFFFF" : "#FFFFFF";  // Weißer Text in Dark Mode
  const selectednodeColor = isDarkMode ? "#f0f0f0" : "#333";  // Helles Highlight im Dark Mode

  useEffect(() => {

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
        .force("center", d3.forceCenter(width / 2, height / 2));
    }

    const simulation = simulationRef.current;

    // Links updaten
    const link = g.selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", linkColor);

    //Links unten 
    link.lower();

    // Nodes updaten
    const node = g.selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", 8)
      .attr("fill", (d) => (d.id === selectedNode ? selectednodeColor : nodeColor))
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
      );

    // Labels updaten
    const labels = g.selectAll(".label")
      .data(nodes)
      .join("text")
      .attr("class", "label")
      .attr("fill", textColor)
      .attr("text-anchor", "middle")
      .attr("dy", 40)
      .attr("font-size", "10px")
      .text((d) => d.label);

    // Simulation mit neuen Daten aktualisieren
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    // Positionen bei jedem Tick aktualisieren
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y - 15);
    });

    return () => {
      // Entferne keine Elemente aus dem SVG, um das Springen zu vermeiden
    };
  }, [nodes, links]);

  useEffect(() => {
    d3.selectAll(".node")
      .attr("fill", (d) => (d.id === selectedNode ? selectednodeColor : nodeColor));
  }, [selectedNode]);
  

  return <svg class="map-bg" ref={svgRef}></svg>;
};

export default ForceGraph;
