import { assets } from "../../../../assets/assets";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Members.css";

const Members = () => {
  const member = [
    {
      fullName: "Mai Văn Đăng",
      sid: "20225699",
      img: assets.Dang,
      role: "Backend Team",
    },
    {
      fullName: "Phùng Duy Nghĩa",
      sid: "20225896",
      img: assets.Nghia,
      role: "Backend Team",
    },
    {
      fullName: "Nguyễn Hoài Nam",
      sid: "20225653",
      img: assets.Nam,
      role: "Frontend Team",
    },
    {
      fullName: "Bùi Quốc Bảo",
      sid: "20225601",
      img: assets.Bao,
      role: "Database Team",
    },
    {
      fullName: "Đặng Kim Ngân",
      sid: "20225751",
      img: assets.Ngan,
      role: "Frontend Team",
    },

  ];

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="container-tdn">
        <div className="slider-container">
          {/* Đang báo lỗi ở dòng 86 này */}
          <Slider {...settings}>
            {member.map((item, index) => {
              return (
                <>
                  <div className="member" key={index}>
                    <div className="member__img">
                      <img src={item.img} alt="ahihi" />
                    </div>
                    <div className="member__info">
                      <div className="name">{item.fullName}</div>
                      <div className="sid">{item.sid}</div>
                    </div>
                    <div className="member__role">{item.role}</div>
                  </div>
                </>
              );
            })}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Members;
