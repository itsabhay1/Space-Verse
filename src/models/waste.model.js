import mongoose, {Schema} from "mongoose";

const wasteSchema = new Schema ({
    itemId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        enum: ["expired", "out of use"],
        required: true,
    },
    disposed: {
        type: Boolean,
        default: false,
    },
    disposalDate: {
        type: Date,
        default: Date.now,
    },
    containerId: {
        type: String,
        required: true,
    },
})

export const Waste = mongoose.model("Waste", wasteSchema)