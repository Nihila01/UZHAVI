import React ,{ useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import Divider from "../../components/Divider";
import { Link,useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";  // Assuming it's defined in the 'users' API calls file.
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";


const rules = [
  {
    required: true,
    message: 'This field is required',
  },
];

function Login() {
  
  const navigate = useNavigate();
  const dispatch  = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true))
      const response = await LoginUser(values);
      dispatch(SetLoader(false))
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error.message);
    }
  };

  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px]">
        <h1 className="text-primary text-2xl">Uzhavi - <span className="text-gray-400 text-2xl"> LOGIN</span> </h1>
        <Divider/>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" style={{ backgroundColor: '#003522', borderColor: '#003522' }} htmlType="submit" block className="mt-2">
              Login
            </Button>
            <div className="mt-5 text-center">
              <span className="text-gray-500">
                Don't have an account? <Link to="/register" className="text-primary">Register</Link>
              </span>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
