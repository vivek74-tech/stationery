import mongoose from "mongoose";

import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/product.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const validateProductId = (productId)=>{

    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new ApiError(
            400,
            "Invalid Product ID"
        );
    }

};




/* =========================================
   STOCK IN
========================================= */

const stockIn = asyncHandler(async(req,res)=>{


    const {
        productId,
        quantity,
        note
    } = req.body;



    validateProductId(productId);



    const qty = Number(quantity);



    if(!qty || qty <=0){

        throw new ApiError(
            400,
            "Quantity must be greater than 0"
        );

    }



    const product = await Product.findById(productId);



    if(!product){

        throw new ApiError(
            404,
            "Product not found"
        );

    }



    const previousStock = product.stock;



    product.stock += qty;


    await product.save();



    const inventory = await Inventory.create({

        product: productId,

        type:"IN",

        quantity:qty,

        previousStock,

        currentStock:product.stock,

        note,

        createdBy:req.user._id,

    });




    const result = await Inventory.findById(
        inventory._id
    )
    .populate(
        "product",
        "productName sku stock"
    )
    .populate(
        "createdBy",
        "fullName email role"
    );




    return res.status(201).json(

        new ApiResponse(
            201,
            result,
            "Stock added successfully"
        )

    );

});






/* =========================================
   STOCK OUT
========================================= */


const stockOut = asyncHandler(async(req,res)=>{


    const {
        productId,
        quantity,
        note
    } = req.body;




    validateProductId(productId);



    const qty = Number(quantity);



    if(!qty || qty <=0){

        throw new ApiError(
            400,
            "Quantity must be greater than 0"
        );

    }



    const product = await Product.findById(productId);



    if(!product){

        throw new ApiError(
            404,
            "Product not found"
        );

    }



    if(product.stock < qty){

        throw new ApiError(
            400,
            "Insufficient Stock"
        );

    }




    const previousStock = product.stock;



    product.stock -= qty;



    await product.save();




    const inventory = await Inventory.create({

        product:productId,

        type:"OUT",

        quantity:qty,

        previousStock,

        currentStock:product.stock,

        note,

        createdBy:req.user._id,

    });





    const result = await Inventory.findById(
        inventory._id
    )
    .populate(
        "product",
        "productName sku stock"
    )
    .populate(
        "createdBy",
        "fullName email role"
    );




    return res.status(201).json(

        new ApiResponse(
            201,
            result,
            "Stock removed successfully"
        )

    );


});







/* =========================================
   GET INVENTORY HISTORY
========================================= */


const getInventoryHistory = asyncHandler(async(req,res)=>{


    const page =
        Number(req.query.page) || 1;


    const limit =
        Number(req.query.limit) || 10;



    const skip =
        (page-1)*limit;




    const inventory =
        await Inventory.find()

        .populate(
            "product",
            "productName sku stock"
        )

        .populate(
            "createdBy",
            "fullName email role"
        )

        .sort({
            createdAt:-1
        })

        .skip(skip)

        .limit(limit)

        .lean();




    const totalRecords =
        await Inventory.countDocuments();




    return res.status(200).json(

        new ApiResponse(

            200,

            {

                inventory,

                page,

                limit,

                totalRecords,

                totalPages:
                Math.ceil(
                    totalRecords/limit
                )

            },

            "Inventory history fetched successfully"

        )

    );


});






/* =========================================
 PRODUCT HISTORY
========================================= */


const getInventoryByProduct =
asyncHandler(async(req,res)=>{


    const {
        productId
    } = req.params;



    validateProductId(productId);




    const history =
        await Inventory.find({

            product:productId

        })

        .populate(
            "product",
            "productName sku stock"
        )

        .populate(
            "createdBy",
            "fullName email role"
        )

        .sort({
            createdAt:-1
        })

        .lean();




    return res.status(200).json(

        new ApiResponse(

            200,

            {
                history
            },

            "Product inventory fetched successfully"

        )

    );

});





export {
    stockIn,
    stockOut,
    getInventoryHistory,
    getInventoryByProduct
};