const router=require('express').Router();
const Product = require("../models/productModel");;
const authMiddleware = require('../middlewares/authMiddleware');
const { Router } = require('express');
const cloudinary= require("../config/cloudinaryConfig");
const multer= require("multer");

//add new product
router.post("/add-product", authMiddleware, async(req, res) =>{
    try{
        const newProduct=new Product(req.body)
        await newProduct.save()
        res.send({
            success:true,
            message:"Product added successfully",
        })
    }catch (error) {
        res.send({
            success:false,
            message:error.message,
        })
    }
});
// get product
router.post("/get-products", async(req, res) =>{
    try{
        const{seller,category=[],age=[],status}=req.body
        let filters={}
        if (seller){
            filters.seller = seller;
        }
        if (status){
            filters.status=status;
        }
// filter by category
if(category.length>0){
    filters.category={$in:category};
}










        const Products=await Product.find(
            filters
        ).populate('seller').sort({createdAt:-1});
        
        res.send({
            success:true,
            data:Products,
        });
    }catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});

//get product by id
router.get("/get-product-by-id/:id",async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id).populate('seller');
        res.send({
            success:true,
            data:product,
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});




//edit product
router.put("/edit-product/:id",authMiddleware,async(req,res)=>{
    try {
        await Product.findByIdAndUpdate(req.params.id,req.body);
        res.send({
            success:true,
            message:"Product updated successfully",
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});

// delete a product
router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.send({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });

//get image form pc
const storage=multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,Date.now()+ file.originalname);
    },
});


router.post('/upload-image-to-product', authMiddleware,multer({storage:storage}).single('file'),async(req,res)=>{
    try {
        //upload into cloudinary
const result= await cloudinary.uploader.upload(req.file.path,{
    folder:"Uzhavi",
})

      
        const productId=req.body.productId;
        await Product.findByIdAndUpdate(productId,{
            $push:{Images:result.secure_url},
        });
        res.send({
            success:true,
            message:"Image uploaded successfully",
            data:result.secure_url,
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});

//update product status
router.put("/update-product-status/:id", authMiddleware,async(req,res)=>{
    try {
        const{status}=req.body;
        await Product.findByIdAndUpdate(req.params.id,{status});
        res.send({
            success:true,
            message:"Product status updated successfully",
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});



 
module.exports=router