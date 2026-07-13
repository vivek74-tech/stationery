import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      index: true,
    },

    type: {
      type: String,
      enum: {
        values: ["IN", "OUT"],
        message: "Inventory type must be either IN or OUT",
      },
      required: [true, "Inventory type is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },


    previousStock: {
      type: Number,
      default: 0,
      min: 0,
    },


    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },


    note: {
      type: String,
      trim: true,
      default: "",
      maxlength: [300, "Note cannot exceed 300 characters"],
    },


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created By is required"],
      index: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);


/* ===========================
   INDEXES
=========================== */

inventorySchema.index({
  product: 1,
  createdAt: -1
});

inventorySchema.index({
  type: 1
});


export const Inventory = mongoose.model(
  "Inventory",
  inventorySchema
);