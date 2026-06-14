import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPhone, FiClock, FiArrowLeft } from 'react-icons/fi';
import { FaCar, FaMoneyBillWave } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import { getTaxiById, getSiteConfig } from '../services/api';
import '../css/TaxiPage.css';

function TaxiPage() {
    const { id } = useParams();
    const [taxi, setTaxi] = useState(null);
    const [banner, setBanner] = useState({ desk: '', mobile: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            setLoading(true);
            const [taxiData, configData] = await Promise.all([
                getTaxiById(id),
                getSiteConfig()
            ]);
            setTaxi(taxiData);
            setBanner({
                desk: configData.bannerDesk,
                mobile: configData.bannerMobile
            });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setTaxi(null);
        } finally {
            setLoading(false);
        }
    }

    function getPhoneNumbers(taxiData) {
        if (!taxiData) return [];
        if (taxiData.phones && Array.isArray(taxiData.phones)) {
            return taxiData.phones;
        }
        if (taxiData.phone) {
            return [taxiData.phone];
        }
        return [];
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className="main">
                    <div className="loading-spinner">Загрузка информации о такси...</div>
                </main>
                <Footer />
            </>
        );
    }

    if (!taxi) {
        return (
            <>
                <Header />
                {banner.desk && <Banner deskUrl={banner.desk} mobileUrl={banner.mobile} />}
                <main className="main">
                    <div className="taxi-detail-card">
                        <h1 className="detail-title">Такси не найдено</h1>
                        <Link to="/" className="back-link"><FiArrowLeft size={14} /> Вернуться на главную</Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const phoneNumbers = getPhoneNumbers(taxi);

    return (
        <>
            <Header />
            {banner.desk && <Banner deskUrl={banner.desk} mobileUrl={banner.mobile} />}
            <main className="main">
                <div className="taxi-detail-card">
                    <h1 className="detail-title">{taxi.name}</h1>
                    
                    <div className="detail-info">
                        <div className="info-item">
                            <span className="info-label"><FiClock size={14} /> Время подачи:</span>
                            <span className="info-value">{taxi.time}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label"><FaMoneyBillWave size={14} /> Стоимость:</span>
                            <span className="info-value">{taxi.price}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label"><FaCar size={14} /> Класс авто:</span>
                            <span className="info-value">{taxi.class}</span>
                        </div>
                    </div>

                    <div className="detail-description">
                        <h3>Описание</h3>
                        <p>{taxi.description}</p>
                    </div>

                    <div className="detail-contacts">
                        <h3><FiPhone size={20} /> Контакты автопарка</h3>
                        <div className="phones-list">
                            {phoneNumbers.length > 0 ? (
                                phoneNumbers.map((phone, index) => (
                                    <div key={index} className="phone-item">
                                        <span className="phone-number">{phone}</span>
                                        <button 
                                            className="call-btn"
                                            onClick={() => window.location.href = `tel:${phone.replace(/\D/g, '')}`}
                                        >
                                            Позвонить
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="no-phone">Телефон не указан</p>
                            )}
                        </div>
                    </div>

                    <Link to="/" className="back-link"><FiArrowLeft size={14} /> Назад к списку такси</Link>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default TaxiPage;
