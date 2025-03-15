/*
const currentmap = {
    "id": "root",
    "text": "Hauptthema",
    "children": [
      {
        "id": "node1",
        "text": "Unterthema 1",
        "children": [
          {
            "id": "node1-1",
            "text": "Detail 1"
          },
          {
            "id": "node1-2",
            "text": "Detail 2",
            "children": [
              {
                "id": "node1-2-1",
                "text": "Detail 2-1"
              }
            ]
          }
        ]
      },
      {
        "id": "node2",
        "text": "Unterthema 2"
      }
    ]
  }

const newNode = { id: "node1-3", text: "Neues Detail" };
*/
function addNodeToTree(tree, parentId, newNode) {
    // Falls die aktuelle Node die gesuchte Parent-ID hat, füge das Kind hinzu
    if (tree.id === parentId) {
        tree.children = tree.children ? [...tree.children, newNode] : [newNode];
        return true; // Signalisiert, dass die Einfügung erfolgreich war
    }

    // Falls die Node Kinder hat, gehe rekursiv durch die Liste
    if (tree.children) {
        for (const child of tree.children) {
            if (addNodeToTree(child, parentId, newNode)) {
                return true; // Abbruch, wenn die Node gefunden wurde
            }
        }
    }

    return false; // Falls die Parent-ID nicht gefunden wurde
}

export function addNodeToCurrentMap(currentMap, parentId, newNode) {
    // Kopie des aktuellen Objekts, um Mutationen zu vermeiden (optional)
    const updatedMap = JSON.parse(JSON.stringify(currentMap));

    // Füge die neue Node ein
    const success = addNodeToTree(updatedMap, parentId, newNode);

    if (!success) {
        console.error("Fehler: Parent-ID nicht gefunden");
        return currentMap; // Falls nichts geändert wurde, das Original zurückgeben
    }

    return updatedMap; // Falls du das aktualisierte Objekt noch irgendwo brauchst
}
