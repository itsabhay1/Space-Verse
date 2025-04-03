import mongoose, {Schema} from "mongoose";

const containerSchema = new Schema({
    containerId: {
        type: String,
        // enum : ["container F", "container S", "container M", ],
        // default: "container F",
        required: true,
        // unique: true,
    },
    zone: {
        type: String,
        // enum: ["zone 0","zone 1", "zone 2", "zone 3"],
        // default: "zone 0",
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    depth: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    maxWeight: {
        type: Number,
        required: true,
    },
    currentWeight: {
        type: Number,
        default: 0,
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: "Item",
    }],

    occupiedSpaces: {
     type: Array,
     default: []
     } 
})

export const Container = mongoose.model("Container", containerSchema)