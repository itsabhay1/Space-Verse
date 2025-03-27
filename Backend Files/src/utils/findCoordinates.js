
export function findCoordinate(container, item) {
    console.log(" Running findCoordinate for:", item.itemId);
    console.log(" Item Details:", item);

    if (!item.dimensions) {
        console.error(" Item is missing dimensions!");
        return { success: false, error: "Item dimensions are missing." };
    }

    let { width, depth, height } = item.dimensions || {};
    
    if (!width || !depth || !height) {
        console.error(" Invalid dimensions!", item.dimensions);
        return { success: false, error: "Invalid item dimensions." };
    }

    let occupiedSpaces = container.occupiedSpaces || [];
    
    for (let x = 0; x + width <= container.width; x += 1) {
        for (let y = 0; y + depth <= container.depth; y += 1) {
            for (let z = 0; z + height <= container.height; z += 1) {
                
                let start = { width: x, depth: y, height: z };
                let end = { width: x + width, depth: y + depth, height: z + height };
                
                let overlaps = occupiedSpaces.some(space => 
                    space.start.width < end.width &&
                    space.end.width > start.width &&
                    space.start.depth < end.depth &&
                    space.end.depth > start.depth &&
                    space.start.height < end.height &&
                    space.end.height > start.height
                );

                if (!overlaps) {
                    console.log(" Space found at:", start);
                    container.occupiedSpaces.push({ start, end });
                    return { start, end };
                }
            }
        }
    }
    console.error(" No space found for item:", item.itemId);
    return null;
}
