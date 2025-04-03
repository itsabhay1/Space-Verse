
export function findCoordinate(container, item) {
    console.log("🔍 Running findCoordinate for:", item.itemId);
    console.log("📦 Item Details:", item);

    // Ensure the item has dimensions
    if (!item.dimensions) {
        console.error("❌ Item is missing dimensions!");
        return { success: false, error: "Item dimensions are missing." };
    }

    let { width, depth, height } = item.dimensions || {};
    
    if (!width || !depth || !height) {
        console.error("❌ Invalid dimensions!", item.dimensions);
        return { success: false, error: "Invalid item dimensions." };
    }

    // Ensure occupiedSpaces is properly initialized
    container.occupiedSpaces = container.occupiedSpaces || [];
    
    console.log("📏 Container Dimensions:", `Width: ${container.width}, Depth: ${container.depth}, Height: ${container.height}`);
    console.log("📐 Item Dimensions:", `Width: ${width}, Depth: ${depth}, Height: ${height}`);
    

    // Try placing the item in the available space
    for (let x = 0; x + width <= container.width; x += 1) {
        for (let y = 0; y + depth <= container.depth; y += 1) {
            for (let z = 0; z + height <= container.height; z += 1) {
                
                let start = { width: x, depth: y, height: z };
                let end = { width: x + width, depth: y + depth, height: z + height };

                

                let overlaps = container.occupiedSpaces.some(space => 
                    !(end.width <= space.start.width || start.width >= space.end.width ||
                      end.depth <= space.start.depth || start.depth >= space.end.depth ||
                      end.height <= space.start.height || start.height >= space.end.height)
                );
                

                if (!overlaps) {
                    console.log(" Space found at:", start);
                    container.occupiedSpaces.push({ start, end });
                    return { success: true, start, end };
                }
            }
        }
    }

    console.error(`❌ No space found for item ${item.itemId}!`);
    return { success: false, message: `No space for item ${item.itemId}` };
}
