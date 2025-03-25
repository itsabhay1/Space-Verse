import mongoose, {Schema} from "mongoose";

const ItemSchema = new Schema({
        itemId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
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
        mass: {
            type: Number,
            required: true,
        },
        priority: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        expiryDate: {
            type: Date,
            default: null,
        },   
        usageLimit: {
            type: Number,
            default: null,
        },
        preferredZone: {
            type: String,
            required: true,
        },
        containerId: {
            type: String,
            default: null,
        },
        position:{
            start :{
                width:Number,
                depth:Number,
                height:Number
            },
            end:{
                width:Number,
                depth:Number,
                height:Number
            }
        },
        status: {
            type: String,
            enum: ["stored","retreived","waste"],
            default: "stored",
        },

});

export const Item = mongoose.model("Item", ItemSchema);
