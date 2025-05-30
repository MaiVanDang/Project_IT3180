import "./LoginSignUp.css";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { AuthService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Định nghĩa kiểu dữ liệu cho response
interface UserData {
  name: string;
  email: string;
}

interface AuthResponse {
  data: {
    accessToken: string;
    user: UserData;
  };
}

interface ErrorResponse {
  message: string;
}

// Component LoginSignUp dùng để hiển thị các form đăng nhập và đăng ký
const LoginSignUp = () => {
  // State: True - Đăng ký, False - Đăng nhập
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleToggle = (type: "login" | "register") => {
    setIsSignUpActive(type === "register");
  };

  const handleRememberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRemember(e.target.checked);
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (registerData.password !== registerData.confirm) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const response = await axios.post<{ data: UserData }>("http://localhost:8080/api/v1/users/register", {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });

      if (response.status === 201) {
        localStorage.setItem("name", response.data.data.name);
        toast.success("Đăng ký thành công!");
        navigate("/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        const errorMessage = (axiosError.response.data as ErrorResponse).message || "Đăng ký thất bại!";
        toast.error(errorMessage);
      } else {
        toast.error("Đã xảy ra lỗi khi đăng ký!");
      }
      console.error(error);
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (!loginData.email || !loginData.password) {
      toast.error("Vui lòng điền đầy đủ thông tin đăng nhập!");
      return;
    }

    try {
      const response = await axios.post<AuthResponse>("http://localhost:8080/api/v1/auth/login", {
        email: loginData.email,
        password: loginData.password,
      });

      const { accessToken, user } = response.data.data;

      // Lưu thông tin đăng nhập vào localStorage nếu chọn "Remember me"
      if (remember) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("name", user.name);
        localStorage.setItem(
          "remember",
          JSON.stringify({ email: loginData.email, password: loginData.password })
        );
      } else {
        // Nếu không chọn "Remember", chỉ lưu accessToken và tên
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("name", user.name);
      }

      navigate("/dashboard");
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.data) {
        const errorMessage = (axiosError.response.data as ErrorResponse).message || "Đăng nhập thất bại!";
        toast.error(errorMessage);
      } else {
        toast.error("Có lỗi xảy ra khi đăng nhập!");
      }
      console.error("Login Failed!", error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const url = await AuthService.authenticate("google");
      window.location.href = url;
    } catch (error: unknown) {
      // Sử dụng type narrowing để truy cập an toàn các thuộc tính
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        console.error("Lỗi xác thực với Google: ", axiosError.response?.data?.message || "");
        toast.error("Lỗi xác thực với Google");
      } else {
        console.error("Lỗi xác thực với Google");
        toast.error("Không thể kết nối với dịch vụ Google");
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const rememberedDataStr = localStorage.getItem("remember");
    if (rememberedDataStr) {
      try {
        const rememberedData = JSON.parse(rememberedDataStr) as { email: string, password: string };
        setLoginData(rememberedData);
        setRemember(true); // Checkbox được tick nếu đã lưu trước đó
      } catch (error) {
        console.error("Error parsing remembered data", error);
      }
    }
  }, []);

  return (
    <div className="main-sign-in-up">
      <div className={`container-dn ${isSignUpActive ? "active" : ""}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <div className="header">
              <h1 className="text">Create Account</h1>
              <div className="underline"></div>
            </div>
            <div className="inputs">
              <div className="input">
                <input
                  className="w-full outline-blue-500 border-2 border-gray-400 rounded-xl p-3 mt-1 bg-transparent"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={registerData.name}
                  onChange={handleRegisterInputChange}
                />
              </div>
              <div className="input">
                <input
                  className="w-full outline-blue-500 border-2 border-gray-400 rounded-xl p-3 mt-1 bg-transparent"
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={registerData.email}
                  onChange={handleRegisterInputChange}
                />
              </div>
              <div className="input">
                <input
                  className="w-full outline-blue-500 border-2 border-gray-400 rounded-xl p-3 mt-1 bg-transparent"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={handleRegisterInputChange}
                  autoComplete="new-password"
                />
              </div>
              <div className="input">
                <input
                  className="w-full outline-blue-500 border-2 border-gray-400 rounded-xl p-3 mt-1 bg-transparent"
                  type="password"
                  name="confirm"
                  placeholder="Confirm password"
                  value={registerData.confirm}
                  onChange={handleRegisterInputChange}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <button className="btn-tdn" type="submit">
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <div className="header">
              <h1 className="text">Đăng nhập</h1>
              <div className="underline"></div>
            </div>
            <div className="inputs">
              <div className="input">
                <input
                  type="email"
                  className="w-full outline-blue-500 border-2 border-gray-400 rounded-xl p-3 mt-1 bg-transparent"
                  placeholder="Email"
                  name="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                />
              </div>
              <div className="input">
                <input
                  type="password"
                  className="w-full outline-blue-500 border-2 border-gray-400 rounded-xl p-3 mt-1 bg-transparent"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <div className="mt-4 mr-20 remember-container">
              <input className="scale-110" type="checkbox" id="remember" checked={remember} onChange={handleRememberChange} />
              <label className="ml-2 text-base remember" htmlFor="remember">
                Ghi nhớ mật khẩu
              </label>
            </div>
            <button className="btn-tdn" type="submit">
              Đăng nhập
            </button>

            {/* Login with Google Button */}
            <div className="social-login">
              <button
                onClick={loginWithGoogle}
                className="mt-3 p-3 google-login-btn active:scale-95 hover:scale-[1.02] font-medium flex justify-center items-center rounded-xl border-2 border-gray-200 py-2 gap-3"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 0 256 262"
                  id="google"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  ></path>
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
                Đăng nhập với Google
              </button>
            </div>
          </form>
        </div>

        {/* Khung chuyển đổi giữa Đăng Ký và Đăng Nhập */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="text-tdn">Xin chào!</h1>
              <p>
                Nếu bạn đã có tài khoản, <strong>Đăng nhập</strong>
              </p>
              <button id="login" className="btn-tdn-2" onClick={() => handleToggle("login")} type="button">
                Đăng nhập
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="text-tdn">Xin chào!</h1>
              <p>
                Nếu bạn không có tài khoản? <strong>Đăng ký</strong>
              </p>
              <button id="register" className="btn-tdn-2" onClick={() => handleToggle("register")} type="button">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;