import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ForceGraphTest = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 600, height = 400;

    const nodes = [
      { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
    ];
    const links = [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 2, target: 4 },
      { source: 2, target: 5 },
    ];

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999");

    const node = svg.selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", "steelblue");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

  }, []);

  return <svg ref={svgRef}></svg>;
};

export default ForceGraphTest;
