import React, { useEffect } from "react";
import { Form, Input, Button, Divider, message } from "antd"; // Add 'message'
import { Link,useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users"; // Use relative import
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";


const rules = [
  {
    required: true,
    message: "required",
  },
];

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true))
      const response = await RegisterUser(values);
     
      dispatch(SetLoader(false))
      if (response.success) {
        navigate("/Login")
        message.success(response.message); // Success message
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error.message); // Error message
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
        <h1 className="text-primary text-2xl">
          Uzhavi - <span className="text-gray-400 text-2xl"> REGISTER</span>{" "}
        </h1>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={rules}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              style={{ backgroundColor: "#003522", borderColor: "#003522" }}
              htmlType="submit"
              block
              className="mt-2"
            >
              Register
            </Button>

            <div className="mt-5 text-center">
              <span className="text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-primary">
                  Login
                </Link>
              </span>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Register;
