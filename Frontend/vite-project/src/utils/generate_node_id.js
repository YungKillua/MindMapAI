export function generateNewNodeId(nodes, parentId) {
    console.log(nodes);

    // Falls die Parent-ID "root" ist, dann suchen wir alle direkten Kinder von "root-"
    const prefix = parentId === "root" ? "root-" : `${parentId}-`;

    // Finde alle Nodes, die direkt unter der Parent-ID liegen
    const matchingNodes = nodes.filter(node => node.id.startsWith(prefix));

    // Extrahiere die letzten Zahlen
    const numbers = matchingNodes.map(node => {
        const parts = node.id.split('-');
        const lastPart = parts[parts.length - 1];
        return /^\d+$/.test(lastPart) ? parseInt(lastPart, 10) : 0;
    });

    // Bestimme die nächste Nummer
    const nextNumber = (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;

    // Generiere die neue ID
    return `${prefix}${nextNumber}`;
}
