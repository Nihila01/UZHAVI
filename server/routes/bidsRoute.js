const router=require('express').Router();
const Bid=require('../models/bidModel');
const authMiddleware = require('../middlewares/authMiddleware');

//place bid
router.post('/place-new-bid',authMiddleware, async(req,res)=>{
    try {
      console.log(req.body);
      const newBid=new Bid(req.body) ; 
      await newBid.save();
      res.send({success:true,data:req.body});
    } catch (error) {
        res.send({success:false,message:error.message});
    }
});

// get all bids
router.post("/get-all-bids", authMiddleware, async (req, res) => {
  try {
      const { product } = req.body; // Only get product from req.body
      if (!product) {
          return res.send({ success: false, message: "Product ID is required" });
      }

      const bids = await Bid.find({ product }) // Filter based on product
          .populate("product")
          .populate("buyer")
          .populate("seller")
          .sort({ createdAt: -1 });

      res.send({ success: true, data: bids });
  } catch (error) {
      res.send({ success: false, message: error.message });
  }
});

  
  
  module.exports = router;