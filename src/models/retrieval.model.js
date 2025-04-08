import mongoose, {Schema} from "mongoose";

const retrievalSchema = new Schema({
    itemId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    containerId: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        enum: ["retrieved", "returned"],
        required: true,
    },
})

export const Retrieval = mongoose.model("Retrieval", retrievalSchema)