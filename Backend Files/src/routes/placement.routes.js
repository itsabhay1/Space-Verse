import express from 'express';
// import Container from "../models/Container.js";
import {Item} from "../models/placement.model.js";
// import { findCoordinate } from '../utils/findCoordinates';

const app = express.Router();

app.post("/", async (req , res) => {
    const {items , containers} = req.body;

    try {
        let placement = [];

        for (let itemData of items) {
            let container = containers.find(c => c.zone === itemData.preferredZone) || containers[0];
            let coordinates = findCoordinate(container, itemData);

            if(!coordinates){
                return res.status(400).json({
                    success : false , 
                    message : "Item cannot be placed in the given coordinate"
                });
            }

            const newItem = await Item.create({
                ...itemData,
                container: containerId,
                position : coordinates
            });

            container.items.push(newItem._id);
            await container.save();

            placement.push({
                itemId : itemData.itemId,
                containerId : containerId,
                position: coordinates
            });
        }

        res.json({
            success : true, placement
        });
    } catch (error) {
        res.status(500).json({
            success : false ,
            message : "Internal Server Error"
        });
    }

});

export default app;