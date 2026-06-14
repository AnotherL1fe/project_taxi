import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiClock } from 'react-icons/fi';
import { FaCar, FaMoneyBillWave } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import { getTaxis, getSiteConfig } from '../services/api';
import '../css/HomePage.css';

function HomePage() {
    const [taxis, setTaxis] = useState([]);
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalTaxi, setModalTaxi] = useState(null);

    async function loadData() {
        try {
            setLoading(true);
            const [taxisData, configData] = await Promise.all([
                getTaxis(),
                getSiteConfig()
            ]);
            
            setTaxis(taxisData);
            setBanner({
                desk: configData.bannerDesk,
                mobile: configData.bannerMobile
            });
        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
            setError('Не удалось загрузить данные.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();

        const interval = setInterval(loadData, 30000);

        const handleAdminUpdate = () => {
            loadData();
        };
        window.addEventListener('adminDataUpdated', handleAdminUpdate);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('adminDataUpdated', handleAdminUpdate);
        };
    }, []);

    function getPhoneNumbers(taxi) {
        if (!taxi) return [];
        if (taxi.phones && Array.isArray(taxi.phones)) {
            return taxi.phones.filter(p => p.trim() !== '');
        }
        if (taxi.phone) {
            return [taxi.phone];
        }
        return [];
    }

    function openPhoneModal(taxi) {
        setModalTaxi(taxi);
    }

    function closePhoneModal() {
        setModalTaxi(null);
    }

    function formatPhoneForTel(phone) {
        return phone.replace(/\D/g, '');
    }

    if (loading) return (
        <>
            <Header />
            <main className="main">
                <div className="loading-spinner">Загрузка такси...</div>
            </main>
            <Footer />
        </>
    );

    if (error) return (
        <>
            <Header />
            <main className="main">
                <div className="error-message">{error}</div>
            </main>
            <Footer />
        </>
    );

    return (
        <>
            <Header />
            {banner && <Banner deskUrl={banner.desk} mobileUrl={banner.mobile} />}
            <main className="main">
                <div className="fleet-list">
                    {taxis.map(taxi => {
                        const phones = getPhoneNumbers(taxi);
                        const displayPhone = phones.length > 0 ? phones[0] : 'Телефон не указан';
                        return (
                            <div key={taxi.id} className="fleet-item">
                                <div className="fleet-item-name">
                                    <Link to={`/taxi/${taxi.id}`}>{taxi.name}</Link>
                                </div>
                                <div className="fleet-item-details">
                                    <span><FiClock size={15} /> {taxi.time}</span>
                                    <span><FaMoneyBillWave size={15} /> {taxi.price}</span>
                                    <span><FaCar size={15} /> {taxi.class}</span>
                                </div>
                                <button className="fleet-phone-btn" onClick={() => openPhoneModal(taxi)}>
                                    <FiPhone size={12} /> Телефон
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main>

            {modalTaxi && (
                <div className="modal-overlay" onClick={closePhoneModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3><FiPhone size={18} /> {modalTaxi.name}</h3>
                        <ul className="modal-phones">
                            {getPhoneNumbers(modalTaxi).map((phone, index) => (
                                <li key={index}>
                                    <span className="phone-number">{phone}</span>
                                    <button
                                        className="modal-call-btn"
                                        onClick={() => window.location.href = `tel:${formatPhoneForTel(phone)}`}
                                    >
                                        Позвонить
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className="modal-close-btn" onClick={closePhoneModal}>Закрыть</button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default HomePage;
