import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
  const adminLoginUrl = `${adminUrl}/?role=admin`;
  const doctorLoginUrl = `${adminUrl}/?role=doctor`;

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || error.message || "Yêu cầu thất bại",
      );
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}
        </p>
        <p>
          Vui lòng {state === "Sign Up" ? "đăng ký" : "đăng nhập"} để đặt lịch
          khám
        </p>
        {state === "Sign Up" ? (
          <div className="w-full ">
            <p>Họ và tên</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              required
            />
          </div>
        ) : null}
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full ">
          <p>Mật khẩu</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
          {state === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Đã có tài khoản?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Đăng nhập tại đây
            </span>
          </p>
        ) : (
          <p>
            Chưa có tài khoản?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Đăng ký tại đây
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
