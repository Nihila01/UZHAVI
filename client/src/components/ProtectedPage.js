import React, { useEffect } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { SetUser } from "../redux/usersSlice";


function ProtectedPage({ children }) {
  const {user}=useSelector((state)=>state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateToken = async () => { 
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      if (response.success) {
       dispatch(SetUser(response.data
       ));
      } else {
        message.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  } ,[navigate]);

  return (
    user && (
      <div>
        {/* Primary Header */}
        <div className="flex justify-between items-center bg-primary p-5">
          <h1 className="text-2xl text-white cursor-pointer"
          onClick={()=>navigate("/")}
          > UZHAVI</h1>
          <div className="bg-white py-2 px-5 rounded flex gap-1 items-center">
            <i className="ri-user-fill"></i>
            <span className="underline cursor-pointer uppercase"
            onClick={()=>{
              if (user.role==='user')
                { navigate("/profile");
                }else{
                  navigate("/admin");
                }
            }}>
              {user.name}
            </span>
            <i
              className="ri-logout-box-r-line ml-10"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5">
          {children}
        </div>
      </div>
    )
  );
}

export default ProtectedPage;
