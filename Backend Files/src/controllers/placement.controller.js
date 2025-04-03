
import { Container } from "../models/container.model.js";
import { Item } from "../models/placement.model.js";
import { findCoordinate } from "../utils/findCoordinates.js";

// API for Placement and Rearrangement
const placeOrRearrangeItem = async (req, res) => {
    const { action, items, containers = [], itemId, fromContainer, fromPosition, toContainer } = req.body || {};

    try {
        let placementSteps = [];
        let rearrangementSteps = [];
        let step = 1;

        if (Array.isArray(containers) && containers.length > 0) { // Ensure containers is an array
            for (let containerData of containers) {
                let container = await Container.findOne({ containerId: containerData.containerId });

                if (!container) {
                    container = new Container(containerData);
                    await container.save();
                }
            }
        }

        // Placement logic (When No Action is Specified)
        if (!action) {
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ success: false, message: "No items provided" });
            }

            for (let itemData of items) {
                let existingItem = await Item.findOne({ itemId: itemData.itemId });

                if (existingItem) {
                    return res.status(400).json({ success: false, message: `Item ID ${itemData.itemId} already exists!` });
                }


            let container = await Container.findOne({ containerId: req.body.containerId });

if (!container) {
    container = await Container.create({
        containerId: req.body.containerId,
        zone: req.body.zone,
        width: req.body.width,
        depth: req.body.depth,
        height: req.body.height,
        maxWeight: req.body.maxWeight,
        currentWeight: req.body.currentWeight || 0,
        occupiedSpaces: [],
        items: []
    });
}




                if (!container) {
                    return res.status(400).json({ success: false, message: "No containers available" });
                }

                console.log("Placing item:", itemData);

                let coordinates = findCoordinate(container, itemData);

                if (!coordinates) {
                    return res.status(400).json({ success: false, message: `No space for item ${itemData.itemId}` });
                }

                const { dimensions, ...restItemData } = itemData;

                const newItem = await Item.create({
                    ...restItemData,
                    width: dimensions.width,
                    depth: dimensions.depth,
                    height: dimensions.height,
                    containerId: container.containerId,
                    position: coordinates
                });


                await Container.updateOne(
                    { containerId: container.containerId },
                    { $push: { occupiedSpaces: { start: coordinates.start, end: coordinates.end } } }
                );
                

                placementSteps.push({
                    action: "place",
                    itemId: itemData.itemId,
                    toContainer: container.containerId,
                    toPosition: coordinates
                });
            }

            return res.json({ success: true, message: "Items placed successfully", placementSteps });
        }

        // Handling Rearrangement Actions (Move, Remove, Place)
        let item = await Item.findOne({ itemId });

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        if (action === "remove") {
            await Item.deleteOne({ itemId });

            let sourceContainer = await Container.findOne({ containerId: fromContainer });
            if (sourceContainer) {
                sourceContainer.items.pull(item._id);
                sourceContainer.occupiedSpaces = sourceContainer.occupiedSpaces.filter(
                    (space) => space.start !== fromPosition.start && space.end !== fromPosition.end
                ); //  Remove occupied space
                await sourceContainer.save();
            }

            rearrangementSteps.push({ step: step++, action: "remove", itemId, fromContainer, fromPosition });

            return res.json({ success: true, message: "Item removed", rearrangementSteps });
        }

        if (action === "move") {
            let sourceContainer = await Container.findOne({ containerId: fromContainer });
            let destinationContainer = await Container.findOne({ containerId: toContainer });

            if (!sourceContainer) {
                return res.status(400).json({ success: false, message: `Source container ${fromContainer} does not exist` });
            }
            if (!destinationContainer) {
                return res.status(400).json({ success: false, message: `Target container ${toContainer} does not exist` });
            }

            let newPosition = findCoordinate(destinationContainer, item);

            if (!newPosition) {
                return res.status(400).json({ success: false, message: "No space available in the target container" });
            }

           
            await Item.updateOne(
                { itemId: item.itemId },
                { $set: { containerId: container.containerId, position: newPosition } }
            );
            

            sourceContainer.items.pull(item._id);
            sourceContainer.occupiedSpaces = sourceContainer.occupiedSpaces.filter(
                (space) => space.start !== fromPosition.start && space.end !== fromPosition.end
            ); //  Remove previous occupied space
            await sourceContainer.save();

            destinationContainer.items.push(item._id);
            destinationContainer.occupiedSpaces.push({ start: newPosition.start, end: newPosition.end }); //  Add occupied space
            await destinationContainer.save();

            rearrangementSteps.push({
                step: step++,
                action: "move",
                itemId,
                fromContainer,
                fromPosition,
                toContainer,
                toPosition: newPosition
            });

            return res.json({ success: true, message: "Item moved successfully", rearrangementSteps });
        }

        if (action === "place") {
            let container = await Container.findOne({ containerId: toContainer }) || await Container.findOne();

            if (!container) {
                return res.status(400).json({ success: false, message: "No containers available" });
            }

            let newPosition = findCoordinate(container, item);

            if (!newPosition) {
                return res.status(400).json({ success: false, message: "No space available" });
            }

            item.containerId = container.containerId;
            item.position = newPosition;
            await item.save();

            container.items.push(item._id);
            container.occupiedSpaces.push({ start: newPosition.start, end: newPosition.end }); // Add occupied space
            await container.save();

            rearrangementSteps.push({
                step: step++,
                action: "place",
                itemId,
                toContainer: container.containerId,
                toPosition: newPosition
            });

            return res.json({ success: true, message: "Items processed successfully", placementSteps, rearrangementSteps });
        }

        return res.status(400).json({ success: false, message: "Invalid action" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export { placeOrRearrangeItem };
