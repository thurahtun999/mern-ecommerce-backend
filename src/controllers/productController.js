import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Create product
//access Private/Admin
export const createProduct =
asyncHandler(async(req, res) => {

    const { name, price, description, category, stock } = req.body;

    let imageUrl ="";
    let public_id = "";

    if(!name || name.trim() === "") {
        res.status(400);
        throw new Error("Name is required");
    }

    if (price && (isNaN(price) || price < 0))
    {
        res.status(400);
        throw new Error("Invalid price");
    }
    if (stock && (isNaN(stock) || stock < 0))
    {
        res.status(400);
        throw new Error("Invalid stock")
    }

    if (req.file) {
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = 
                cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload();

        imageUrl = result.secure_url;
        public_id = result.public_id;
      
    }
    // save product to MongoDB//

    const product = await Product.create({
        name,
        price,
        description,
        category,
        stock,
        image: imageUrl,
        public_id: public_id,
    });
    res.status(201).json(product);
});
 
//Get all products
//Public
export const getProducts = 
asyncHandler(async (req, res) => {
    try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const keyword = req.query.keyword ? {
        name: {$regex: req.query.keyword, $options: "i"},
    }
    :{};

    const priceFilter = {};
  
    if (req.query.minPrice || req.query.maxPrice) {
        priceFilter.price ={};
    }

    if(req.query.minPrice) {
            priceFilter.price.$gte = Number(req.query.minPrice);
        }
    if (req.query.maxPrice) {
            priceFilter.price.$lte = Number(req.query.maxPrice);
        }
    const categoryFilter = req.query.category ? { 
        category: req.query.category}: {};

    const query = {...keyword, ...priceFilter, ...categoryFilter};
    const skip = (page -1) * limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate("user", "name email")
        .sort(req.query.sort || "-createdAt")
        .skip(skip)
        .limit(limit);

        const formattedProducts =
        products.map((p) => ({
            id: p._id.toString(),
            name: p.name,
            price: p.price,
            description: p.description,
            image: p.image,
            category: p.category,
            stock: p.stock,
    }));

        res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            totoalProduct: total,
            products: formattedProducts
        });
    } catch (error) { 
        res.status(500).json({ message: error.message});
    }
    
});

//Get single product
//access Public
export const getProductById = 
asyncHandler(async (req, res) => {
    const product =await
    Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status (404);
        throw new Error("Product not found");
    }
});
export const updateProduct =
asyncHandler(async (req, res) => {


    const name = req.body.name;
    const description= req.body.description;
    const category = req.body.category;

    const price = req.body.price ? Number(req.body.price) : undefined;
    const stock = req.body.stock ? Number(req.body.stock) : undefined;

    const product = await
    Product.findById(req.params.id);

    if(!product) {
        res.status(404);
        throw new Error("Product not found");
    }
 

    if (product) {

        if (name !== undefined && name.trim() === "") 
            {
        res.status(400);
        throw new Error("Name is required");
    }

    if (price !== undefined && (isNaN(price) || price < 0)) {
         res.status(400);
        throw new Error("Invalid price");
    }
       

    if (stock !== undefined && (isNaN(stock) || stock < 0))
    {
        res.status(400);
        throw new Error("Invalid stock")
    }
        
        // update fields//
        product.name = name || product.name;
        product.price = price !== undefined ? price : product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.stock = stock !== undefined ? stock: product.stock;


        //image update
        if (req.file && req.file.buffer) {
            if (product.public_id) {
                await
                cloudinary.uploader.destroy(product.public_id);
            }

            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = 
                    cloudinary.uploader.upload_stream(
                {folder: "products"},
                (error, result) => {
                    if (result) resolve (result);
                    else reject (error);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    const result = await streamUpload();
    product.image = result.secure_url;
    product.public_id = result.public_id;

    } 

     const updatedProduct = await
        product.save();
        res.json(updatedProduct);
} else {
        res.status(404);
        throw new Error("Product not found")

    }
});

export const deleteProduct =
asyncHandler(async (req, res) => {
    const product = await
    Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    } 
    if (product.public_id) {
        await
        cloudinary.uploader.destroy(product.public_id);
    }
    await product.deleteOne();

    res.json({ message: "Product deleted"});
      
});