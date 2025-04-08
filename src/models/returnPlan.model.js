// Undocking module where items are temporarily stored before sent back to earth or disposed of in space

import mongoose, {Schema} from "mongoose";

const returnPlanSchema = new Schema ({
    undockingContainerId: {
        type: String,
        required: true,
    },
    undockingDate: {
        type: Date,
        required: true,
    },
    maxWeight: {
        type: Number,
        required: true,
    },
    returnItems: [
        {
            itemId: String,
            name: String,
            reason: String,
        }
    ],
    totalVolume: {
        type: Number,
        required: true,
    },
    totalWeight: {
        type: Number,
        required: true,
    },
})

export const ReturnPlan = mongoose.model("ReturnPlan", returnPlanSchema)