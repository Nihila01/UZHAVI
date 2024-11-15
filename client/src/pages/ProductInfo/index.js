import React from 'react'
import { useSelector ,useDispatch } from "react-redux";
import { SetLoader } from '../../redux/loadersSlice';
import { GetAllBids, GetProductById, GetProducts } from '../../apicalls/products';
import { Button, Divider, message } from 'antd';
import { useParams } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import moment from "moment"
import BidModal from './BidModal';


function ProductInfo() {
  const{user}=useSelector((state)=>state.users);
  const [showAddNewBid,setshowAddNewBid]=React.useState(false);
  const [product, setProduct]=React.useState(null)
  const navigate=useNavigate() ;
  const dispatch=useDispatch();
  const {id}=useParams();
  const getData=async()=>{
    try {
      dispatch(SetLoader(true))
      const response=await GetProductById(id)
      dispatch(SetLoader(false))
      if(response.success){
        const bidsResponse=await GetAllBids({product:id});
       setProduct({
        ...response.data,
        bids:bidsResponse.data,
       })
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error.message)
    }
  }
  
  React.useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  return (
    product &&(
    <div>
      <div className='grid grid-cols-2'>
        {/*images*/}
        <div className='flex flex-col gap-2'>
        {/* Render other properties if they exist */}
        {product.images && product.images.length > 0 && (
            <img src={product.images[0]} alt={product.name} className='w-full h-96 object-cover' />
          )}
<Divider/>
         <div >
        <h1 className='text-gray-600'>
           Added On
        </h1>
        <span className='text-gray-600'>
          {moment(product.createdAt).format("MMM D , YYYY   hh:mm A")}
        </span>
         </div>


          <div className='flex flex-col gap-3'>
            <div>
            <h1 className='text-2xl font-semibold text-orange-900'>{product.name}</h1>
            <span>
              {product.description}
            </span>
            </div>
            <Divider/>
          <div className='flex flex-col'> 
            <h1 className='text-2xl font-semibold text-orange-900'>Product Details</h1>
            <div className='flex justify-between mt-5'>
              <span> Price </span>
              <span> Rs{product.price}</span>
            </div>
            <div className='flex justify-between mt-5'>
              <span> Category </span>
              <span className='uppercase'> {product.category}</span>
            </div>
          </div>
          <Divider/>
          <div className='flex flex-col'> 
            <h1 className='text-2xl font-semibold text-orange-900'>Seller Details</h1>
            <div className='flex justify-between mt-5'>
              <span> Name </span>
              <span> {product.seller.name}</span>
            </div>
            <div className='flex justify-between mt-5'>
              <span> Email </span>
              <span > {product.seller.email}</span>
            </div>
          </div>
<Divider/>

<div className='flex flex-col'>
  <div className='flex justify-between mb-5'>
  <h1 className='text-2xl font-semibold text-orange-900'>
    Bids
  </h1>
  <Button onClick={()=>setshowAddNewBid(!showAddNewBid)}
  disabled={user._id===product.seller._id} >
    New Bid
  </Button>
</div>
{product.bids.map((bid)=>{
  return <div className='border border-gray-300 border-solid p-3 rounded'>
    <div className='flex justify-between text-gray-700'>
      <span>Name</span>
      <span>{bid.buyer.name}</span>
    </div>
    <div className='flex justify-between text-gray-600'>
      <span>Bid Amount</span>
      <span>Rs{bid.bidAmount}</span>
    </div>
    <div className='flex justify-between text-gray-600'>
      <span>Bid Place On</span>
      <span>
        {""}
        {moment(bid.createdAt).format("MMM D, YYYY hh:mm A")}
      </span>
    </div>
  </div>
})}
</div>
          </div>
        </div>
        {showAddNewBid && <BidModal
        product={product}
        reloadData={getData}
        showBidModal={showAddNewBid}
        setShowBidModal={setshowAddNewBid}
        />}
      </div>

    </div>
    )
  );
}

export default ProductInfo