import "./about-us.css";
import { assets } from "../../../assets/assets";

const AboutUs = () => {
  return (
    <>
      <section className="about-us" id="about-us">
        <div className="container-tdn">
          <div className="inner-about-us">
            <div className="about-us__left">
              <div className="left__image">
                <img src={assets.about_us} alt="" />
              </div>
            </div>

            <div className="about-us__right">
              <div className="right__title">Liên hệ</div>

              <div className="right__desc">
                Chung cư BlueMoon tọa lạc ngay ngã tư Văn Phú được khởi công xây dựng năm 2021
                và hoàn thành vào 2023. Chung cư được xây dựng trên diện tích 450m2, gồm 30 tầng,
                tầng 1 làm kiot, 4 tầng đế, 24 tầng nhà ở và 1 tầng penhouse. Khi sở hữu nhà chung cư,
                hộ gia đình hoặc chủ sở hữu sẽ phải bỏ ra một khoản kinh phí đóng định kỳ để thực
                hiện vận hành và bảo dưỡng thường xuyên về cơ sở vật chất. Các hoạt động quản lý và
                thu phí ở chung cư BlueMoon được thực hiện bởi Ban quản trị chung cư do nhân dân
                sinh sống ở đây bầu ra.
              </div>

              <div className="right__icon">
                <ul className="list-icon">
                  <li>
                    <a href="https://github.com/">
                      <i className="bx bxl-github"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/">
                      <i className="bx bxl-linkedin-square"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/">
                      <i className="bx bxl-facebook-square"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
