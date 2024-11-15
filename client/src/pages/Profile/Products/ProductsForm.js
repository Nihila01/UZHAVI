import { Modal, Tabs, Form, message } from "antd";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { AddProduct,EditProduct } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";
import Images from "./Images";


const rules=[{
  required:true,
  message:"Required",
},
];
function ProductsForm({showProductForm,setshowProductForm,selectedProduct,getData}) {
  const [selectedTab="1",setSelectedTab]=React.useState("1");
  const dispatch=useDispatch();
  const{user}=useSelector(state=>state.users)
  const onFinish=async(values)=>{
    try{
      
dispatch(SetLoader(true));
let response=null;
if (selectedProduct){
  response=await EditProduct(selectedProduct._id,values);
}else{
  values.seller=user._id;
      values.status="pending";
  response=await AddProduct(values);
}

dispatch(SetLoader(false));
if(response.success){
getData();
  message.success(response.message);
  setshowProductForm(false);
}
else{
  message.success(response.message);
}
    }catch(error){
      dispatch(SetLoader(false));
      message.error(error.message);
      
    }
  };
  const formRef=React.useRef(null);
  useEffect(()=>{if (selectedProduct){
    formRef.current.setFieldsValue(selectedProduct);
  }},[selectedProduct]);
  return (
    <Modal title=""
    open={showProductForm}
    onCancel={()=>setshowProductForm(false)}
    centered
    width={1000}
    okText="Save"
    onOk={()=>{
      formRef.current.submit();
    }}
    {...(selectedTab==="2"&&{footer:false})}
    >
     <div>
        <h1 className="text-primary text-2xl text-center font-semibold uppercase">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h1> 
    <Tabs defaultActiveKey="1"
    activeKey={selectedTab}
    onChange={(key)=>setSelectedTab(key)}
    >
    <Tabs.TabPane tab="General"  details key="1">
      <Form
      layout="vertical"ref={formRef}onFinish={onFinish}>
       <Form.Item label="Name" name="name" rules={rules}>
        <Input type="text"/>
       </Form.Item>
       <Form.Item label="Description" name="description" rules={rules}>
        <TextArea type="text"/>
       </Form.Item>
       <Form.Item label="Price" name="price"rules={rules}>
        <Input type="number"/>
       </Form.Item>
       <Form.Item label="Category" name="category"rules={rules}>
        <select> 
        <option value="">Select</option>
        <option value="fertilizer">Fertilizer</option>
        <option value="land">Land</option> 
        <option value="machinery">Machinery</option>
        <option value="seeds">Seeds</option>
        </select>
       </Form.Item>
      </Form>
      </Tabs.TabPane>
     <Tabs.TabPane tab="Images" key="2" disabled={!selectedProduct}>
      <Images selectedProduct={selectedProduct}
      getData={getData} 
      setShowProductForm={setshowProductForm}
      />
      
      </Tabs.TabPane>
      </Tabs>
       </div>
    </Modal>
  );
}

export default ProductsForm