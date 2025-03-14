

const mindmap = { "id": "root",
  "text": "Hauptthema",
  "children": [] };

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

  console.log(convertMindmapToGraph(mindmap))
  