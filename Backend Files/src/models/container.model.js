import mongoose, {Schema} from "mongoose";

const containerSchema = new Schema({
    containerId: {
        type: String,
        required: true,
        unique: true,
    },
    zone: {
        type: String,
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
    }]
})

export const Container = mongoose.model("Container", containerSchema)