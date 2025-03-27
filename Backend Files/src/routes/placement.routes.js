
import express from "express";
import { Container } from "../models/container.model.js";
import { Item } from "../models/placement.model.js";
import { findCoordinate } from "../utils/findCoordinates.js";

const router = express.Router();

//  API for Placement and Rearrangement
router.post("/", async (req, res) => {
    const { action, items, containers, itemId, fromContainer, fromPosition, toContainer } = req.body;

    try {
        let placementSteps = [];
        let rearrangementSteps = [];
        let step = 1; // Step counter for rearrangement

        //  Item Placement (No Action Specified)
        if (!action) {
            for (let containerData of containers) {
                let container = await Container.findOne({ containerId: containerData.containerId });

                if (!container) {
                    container = new Container(containerData);
                    await container.save();
                }
            }

            for (let itemData of items) {
                let container = await Container.findOne({ zone: itemData.preferredZone }) || await Container.findOne();

                if (!container) {
                    return res.status(400).json({ 
                        success: false,
                        message: "No containers available" 
                    });
                }

                let coordinates = findCoordinate(container, itemData);

                if (!coordinates) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `No space for item ${itemData.itemId}` 
                    });
                }

                //  Extract dimensions before saving
                const { dimensions, ...restItemData } = itemData;

                const newItem = await Item.create({
                    ...restItemData,
                    width: dimensions.width,
                    depth: dimensions.depth,
                    height: dimensions.height,
                    containerId: container.containerId,
                    position: coordinates
                });

                container.items.push(newItem._id);
                await container.save();

                placementSteps.push({
                    action: "place",
                    itemId: itemData.itemId,
                    toContainer: container.containerId,
                    toPosition: coordinates
                });
            }

            return res.json({
                success: true,
                message: "Items placed successfully",
                placementSteps
            });
        }

        // Handling Rearrangement Actions (Move, Remove, Place)
        let item = await Item.findOne({ itemId });

        if (!item) {
            return res.status(404).json({ 
                success: false, 
                message: "Item not found" 
            });
        }

        if (action === "remove") {
            await Item.deleteOne({ itemId });
            await Container.updateOne({ containerId: fromContainer }, { $pull: { items: item._id } });

            rearrangementSteps.push({
                step: step++,
                action: "remove",
                itemId,
                fromContainer,
                fromPosition
            });

            return res.json({ 
                success: true,
                message: "Item removed", 
                rearrangementSteps 
            });
        }

        if (action === "move") {
            let sourceContainer = await Container.findOne({ containerId: fromContainer });
            let destinationContainer = await Container.findOne({ containerId: toContainer });

            if (!sourceContainer || !destinationContainer) {
                return res.status(400).json({
                    success: false, 
                    message: "Invalid containers" 
                });
            }

            let newPosition = findCoordinate(destinationContainer, item);

            if (!newPosition) {
                return res.status(400).json({
                    success: false,
                    message: "No space available in the target container" 
                });
            }

            await Item.updateOne({ itemId }, { containerId: toContainer, position: newPosition });
            await Container.updateOne({ containerId: fromContainer }, { $pull: { items: item._id } });
            await Container.updateOne({ containerId: toContainer }, { $push: { items: item._id } });

            rearrangementSteps.push({
                step: step++,
                action: "move",
                itemId,
                fromContainer,
                fromPosition,
                toContainer,
                toPosition: newPosition
            });

            return res.json({
                success: true,
                message: "Item moved successfully", 
                rearrangementSteps 
            });
        }

        if (action === "place") {
            let container = await Container.findOne({ containerId: toContainer }) || await Container.findOne();

            if (!container) {
                return res.status(400).json({
                    success: false,
                    message: "No containers available" 
                });
            }

            let newPosition = findCoordinate(container, item);

            if (!newPosition) {
                return res.status(400).json({ 
                    success: false, 
                    message: "No space available" 
                });
            }

            await Item.updateOne({ itemId }, { containerId: container.containerId, position: newPosition });
            await Container.updateOne({ containerId: container.containerId }, { $push: { items: item._id } });

            rearrangementSteps.push({
                step: step++,
                action: "place",
                itemId,
                toContainer: container.containerId,
                toPosition: newPosition
            });

            console.log(" Rearrangement Steps:", rearrangementSteps);

            return res.json({
                success: true,
                message: "Items processed successfully",
                placementSteps,
                rearrangementSteps  
            });
            
        }

        return res.status(400).json({ 
            success: false,
            message: "Invalid action" 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

export default router;