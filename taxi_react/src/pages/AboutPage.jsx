import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import { getSiteConfig } from '../services/api';
import '../css/AboutPage.css';

function AboutPage() {
    const [aboutText, setAboutText] = useState('');
    const [banner, setBanner] = useState({ desk: '', mobile: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const config = await getSiteConfig();
            setAboutText(config.aboutText);
            setBanner({
                desk: config.bannerDesk,
                mobile: config.bannerMobile
            });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setAboutText('Информация о проекте временно недоступна.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className="main">
                    <div className="loading-spinner">Загрузка информации...</div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            {banner.desk && <Banner deskUrl={banner.desk} mobileUrl={banner.mobile} />}
            <main className="main">
                <div className="about-card">
                    <h1 className="about-title">О проекте</h1>
                    <div className="about-content">
                        {aboutText ? (
                            aboutText.split('\n\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))
                        ) : (
                            <p>Информация о проекте временно недоступна.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default AboutPage;
