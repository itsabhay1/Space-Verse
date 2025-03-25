import mongoose, {Schema} from "mongoose";

const ItemSchema = new Schema({
        itemId: String,
        name: String,
        width: Number,
        depth: Number,
        height: Number,
        priority: Number,
        expiryDate: String,   
        usageLimit: Number,
        preferredZone: String ,
        containerId: String,
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
        }

});

const Item = mongoose.model("Item", ItemSchema);
export default Item;
