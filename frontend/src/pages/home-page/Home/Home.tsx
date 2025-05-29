import { useEffect, useRef } from "react";
import { assets } from "../../../assets/assets";
import TechMarquee from "../partials/TechMarquee";
import "./Home.css";
import Typed from "typed.js";

const Home = () => {
  const typedElement = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: ["Dự án quản lý chung cư đô thị BlueMoon"],
      typeSpeed: 80,
      backSpeed: 90,
      loop: true
    });

    return () => {
      typed.destroy(); // Cleanup on component unmount
    };
  }, []);

  // Smooth scroll for #contact-us
  const handleSmoothScroll = (event: any) => {
    event.preventDefault();
    const targetId = event.target.getAttribute("href").slice(1);
    const targetElement: any = document.getElementById(targetId);

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <>
      <section className="home" id="home">
        <div className="container-tdn full-height-page">
          <div className="home__main">
            <div className="main__left">
              <div className="left__title">
                <span ref={typedElement}></span>
              </div>

              <div className="left__desc">
                Phiên bản đầu tiên
              </div>
              {/* <Link to="/signin">

              </Link> */}
              <div className="left__button">
                <a href="/signin" className="button button__active">
                  Đăng nhập
                </a>
                <a
                  href="#contact-us"
                  className="button button-contact"
                  onClick={handleSmoothScroll} // Attach smooth scroll handler
                >
                  Liên hệ
                </a>
              </div>
            </div>
            <div className="main__right">
              <div className="right__img">
                <img src={assets.homepage_main} alt="computer_img" />
              </div>
            </div>
          </div>

          {/* Tech */}
          <TechMarquee />
          {/* End Tech */}
        </div>
      </section>
    </>
  );
};

export default Home;
