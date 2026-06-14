function Banner({ deskUrl, mobileUrl }) {
    return (
        <div className="banner">
            <picture>
                <source media="(max-width: 640px)" srcSet={mobileUrl} />
                <img src={deskUrl} alt="Баннер" className="banner-img" />
            </picture>
        </div>
    );
}

export default Banner;