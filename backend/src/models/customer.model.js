import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
{
    customerName:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    email:{
        type:String
    },
    address:{
        type:String
    }
},
{
    timestamps:true
}
);

export const Customer = mongoose.model("Customer",customerSchema);