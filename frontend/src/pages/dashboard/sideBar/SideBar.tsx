import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./sideBar.css";

const SideBar = () => {
  const [extended, setExtended] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Logout successful!");
    navigate("/");
  };

  return (
    <div className={extended ? "sidebar active" : "sidebar"}>
      <div className="logo_content">
        <div className="logo">
          {/* <img src={assets.logo} alt="" /> */}
          <div className="logo_name">
            HustCity
          </div>
        </div>
        <i
          className="bx bx-menu"
          id="btn"
          onClick={() => setExtended((prev) => !prev)}
        ></i>
      </div>
      <ul className="nav_list">
        <li>
          <Link to="/dashboard/">
            <i className="bx bxs-grid-alt"></i>
            <span className="links_name">Bảng điều khiển</span>
          </Link>
          <span className="tooltip">Bảng điều khiển</span>
        </li>
        <li>
          <Link to="/dashboard/residents">
            <i className="bx bx-user"></i>
            <span className="links_name">Quản lý cư dân</span>
          </Link>
          <span className="tooltip">Quản lý cư dân</span>
        </li>
        <li>
          <Link to="/dashboard/apartments">
            <i className="bx bxs-home"></i>
            <span className="links_name">Quản lý căn hộ</span>
          </Link>
          <span className="tooltip">Quản lý căn hộ</span>
        </li>
        <li>
          <Link to="/dashboard/vehicles">
            <i className="bx bxs-car"></i>
            <span className="links_name">Quản lý phương tiện</span>
          </Link>
          <span className="tooltip">Quản lý phương tiện</span>
        </li>
        <li>
          <Link to="/dashboard/fee-and-fund">
            <i className="bx bx-money-withdraw"></i>
            <span className="links_name">Phí và Quỹ</span>
          </Link>
          <span className="tooltip">Phí và Quỹ</span>
        </li>
        <li>
          <Link to="/dashboard/statistics">
            <i className="bx bx-folder"></i>
            <span className="links_name">Thống kê</span>
          </Link>
          <span className="tooltip">Thống kê</span>
        </li>
        <li>
          <Link to="/dashboard/invoices">
            <i className="bx bxs-file-plus"></i>
            <span className="links_name">Hóa đơn</span>
          </Link>
          <span className="tooltip">Hóa đơn</span>
        </li>
      </ul>
      <div className="profile_content">
        <div className="profile">
          <div className="profile_details">
            <img
              src="https://i.pinimg.com/564x/5e/7b/9c/5e7b9c338994683cdadd9b52d95223cc.jpg"
              alt="Admin profile"
            />
            <div className="name_role">
              <div className="name">
                {name ? name : "Unknown User"}
              </div>
              <div className="role">
                Quản lý
              </div>
            </div>
          </div>
          <i
            title="Logout"
            className="bx bx-log-out"
            id="log_out"
            onClick={handleLogout}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default SideBar;