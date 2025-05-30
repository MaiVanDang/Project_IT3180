import './Header.css'

const handleClickLogo = () => {
    window.scrollTo({
        top: 0,       // Cuộn về đầu trang
        behavior: 'smooth' // Hiệu ứng cuộn mượt
    })
}

const Header = () => {
    return (
        <>
            <div className="home-page__header">
                <div className="inner-header">
                    <div className="header__logo" onClick={handleClickLogo}>
                        HustCity
                    </div>
                    <div className="header__menu">
                        <ul className='inner-menu'>
                            <li className='item-menu active'><a href="#home">Trang chủ</a></li>
                            <li className='item-menu'><a href="#about-us">Thông tin</a></li>
                            <li className='item-menu'><a href="#our-team">Thành viên</a></li>
                            <li className='item-menu'><a href="#contact-us">Liên hệ</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header