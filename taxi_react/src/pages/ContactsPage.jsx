import { useState, useEffect } from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import { getSiteConfig } from '../services/api';
import '../css/ContactsPage.css';

function ContactsPage() {
    const [banner, setBanner] = useState({ desk: '', mobile: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
        
        const handleUpdate = () => {
            loadData();
        };
        window.addEventListener('adminDataUpdated', handleUpdate);
        
        return () => {
            window.removeEventListener('adminDataUpdated', handleUpdate);
        };
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const config = await getSiteConfig();
            
            setBanner({
                desk: config.bannerDesk,
                mobile: config.bannerMobile
            });
            setError(null);
        } catch (err) {
            console.error('Ошибка загрузки баннера:', err);
            setError('Не удалось загрузить баннер');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className="main">
                    <div className="loading-spinner">Загрузка...</div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            {banner.desk && !error && (
                <Banner deskUrl={banner.desk} mobileUrl={banner.mobile} />
            )}
            <main className="main">
                <div className="contact-card">
                    <h1 className="contact-title">Контакты</h1>
                    <div className="contact-info">
                        <div className="contact-item">
                            <span className="contact-icon"><FiMail size={32} /></span>
                            <div className="contact-detail">
                                <h3>Email</h3>
                                <a href="mailto:info@taxi-city.ru">info@taxi-city.ru</a>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon"><FiPhone size={32} /></span>
                            <div className="contact-detail">
                                <h3>Телефон</h3>
                                <a href="tel:+78001234567">+7 (800) 123-45-67</a>
                            </div>
                        </div>
                    </div>
                    <div className="contact-note">
                        <p>По вопросам сотрудничества и добавления таксопарков в каталог пишите на указанный email.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ContactsPage;
