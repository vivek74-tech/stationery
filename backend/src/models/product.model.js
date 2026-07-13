import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        costPrice: {
            type: Number,
            required: true
        },

        sellingPrice: {
            type: Number,
            required: true
        },

        stock: {
            type: Number,
            default: 0
        },

        // Product Image
        image: {
            type: String,
            default: ""
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        productImage: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true
    }
);
productSchema.index({
    productName: "text",
    sku: "text",
});
export const Product = mongoose.model("Product", productSchema);