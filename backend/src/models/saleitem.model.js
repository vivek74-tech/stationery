import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
{
    sale:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Sale"
    },

    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },

    quantity:{
        type:Number,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    subtotal:{
        type:Number,
        required:true
    }
},
{
    timestamps:true
}
);

export const SaleItem = mongoose.model("SaleItem",saleItemSchema);