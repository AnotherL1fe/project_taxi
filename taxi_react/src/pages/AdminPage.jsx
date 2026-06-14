import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPhone, FiClock, FiPlus, FiX } from 'react-icons/fi';
import { FaCar, FaMoneyBillWave, FaTaxi } from 'react-icons/fa';
import logo from '../images/logo_taxi.png';
import {
    getTaxis, createTaxi, updateTaxi, deleteTaxi,
    getArticles, createArticle, deleteArticle,
    getSiteConfig, updateSiteConfig,
    getContacts, updateContacts
} from '../services/api';
import '../css/AdminPage.css';

function AdminPage() {
    const navigate = useNavigate();

    const [taxis, setTaxis] = useState([]);
    const [articles, setArticles] = useState([]);
    const [aboutText, setAboutText] = useState('');
    const [banner, setBanner] = useState({ desk: '', mobile: '' });
    const [contacts, setContacts] = useState({
        email: '',
        phone: '',
        address: '',
        workHours: ''
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('taxis');

    const [newTaxi, setNewTaxi] = useState({
        name: '',
        phones: [''],
        time: 'от 5 мин',
        price: 'от 5 руб',
        class: 'Эконом и комфорт',
        description: ''
    });
    const [editingTaxiId, setEditingTaxiId] = useState(null);

    const [newArticle, setNewArticle] = useState({
        title: '',
        content: '',
        image: '',
        date: new Date().toLocaleDateString('ru-RU')
    });

    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
        if (!isAuthenticated) {
            navigate('/admin/login');
        }
    }, [navigate]);

    useEffect(() => {
        loadAllData();
    }, []);

    async function loadAllData() {
        try {
            setLoading(true);
            const [taxisData, articlesData, configData, contactsData] = await Promise.all([
                getTaxis(),
                getArticles(),
                getSiteConfig(),
                getContacts()
            ]);

            setTaxis(taxisData);
            setArticles(articlesData);
            setAboutText(configData.aboutText);
            setBanner({
                desk: configData.bannerDesk,
                mobile: configData.bannerMobile
            });
            setContacts(contactsData);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            alert('Ошибка загрузки данных. Проверьте подключение к серверу.');
        } finally {
            setLoading(false);
        }
    }

    function handleLogout() {
        sessionStorage.removeItem('adminAuthenticated');
        navigate('/admin/login');
    }

    // ========== УПРАВЛЕНИЕ ТЕЛЕФОНАМИ ==========
    function addPhoneField() {
        setNewTaxi({
            ...newTaxi,
            phones: [...newTaxi.phones, '']
        });
    }

    function removePhoneField(index) {
        const updatedPhones = newTaxi.phones.filter((_, i) => i !== index);
        setNewTaxi({
            ...newTaxi,
            phones: updatedPhones.length ? updatedPhones : ['']
        });
    }

    function updatePhone(index, value) {
        const updatedPhones = [...newTaxi.phones];
        updatedPhones[index] = value;
        setNewTaxi({
            ...newTaxi,
            phones: updatedPhones
        });
    }

    function resetTaxiForm() {
        setNewTaxi({
            name: '',
            phones: [''],
            time: 'от 5 мин',
            price: 'от 5 руб',
            class: 'Эконом и комфорт',
            description: ''
        });
        setEditingTaxiId(null);
    }

    function startEditTaxi(taxi) {
        setNewTaxi({
            name: taxi.name,
            phones: taxi.phones && taxi.phones.length > 0 ? [...taxi.phones] : [taxi.phone || ''],
            time: taxi.time,
            price: taxi.price,
            class: taxi.class,
            description: taxi.description
        });
        setEditingTaxiId(taxi.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ========== ТАКСИ ==========
    async function saveTaxi() {
        if (!newTaxi.name || !newTaxi.phones[0]) {
            alert('Заполните название и хотя бы один телефон');
            return;
        }

        const phones = newTaxi.phones.filter(p => p.trim() !== '');

        if (phones.length === 0) {
            alert('Введите хотя бы один номер телефона');
            return;
        }

        try {
            if (editingTaxiId) {
                await updateTaxi(editingTaxiId, { ...newTaxi, phones });
                alert('Таксопарк обновлён!');
            } else {
                await createTaxi({ ...newTaxi, phones });
                alert('Таксопарк добавлен!');
            }
            await loadAllData();
            resetTaxiForm();
            window.dispatchEvent(new Event('adminDataUpdated'));
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка при сохранении таксопарка');
        }
    }

    async function deleteTaxiItem(id) {
        if (confirm('Удалить этот таксопарк?')) {
            try {
                await deleteTaxi(id);
                await loadAllData();
                alert('Таксопарк удалён');
                window.dispatchEvent(new Event('adminDataUpdated'));
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('Ошибка при удалении таксопарка');
            }
        }
    }

    // ========== СТАТЬИ ==========
    async function addArticle() {
        if (!newArticle.title) {
            alert('Введите заголовок статьи');
            return;
        }

        try {
            const articleData = {
                ...newArticle,
                image: newArticle.image || 'https://placehold.co/500x300/2c2c2c/F59A2F?text=Статья'
            };
            await createArticle(articleData);
            await loadAllData();
            setNewArticle({
                title: '', content: '', image: '',
                date: new Date().toLocaleDateString('ru-RU')
            });
            alert('Статья добавлена!');
            window.dispatchEvent(new Event('adminDataUpdated'));
        } catch (error) {
            console.error('Ошибка добавления статьи:', error);
            alert('Ошибка при добавлении статьи');
        }
    }

    async function deleteArticleItem(id) {
        if (confirm('Удалить эту статью?')) {
            try {
                await deleteArticle(id);
                await loadAllData();
                alert('Статья удалена');
                window.dispatchEvent(new Event('adminDataUpdated'));
            } catch (error) {
                console.error('Ошибка удаления статьи:', error);
                alert('Ошибка при удалении статьи');
            }
        }
    }

    // ========== КОНФИГУРАЦИЯ ==========
    async function saveBanner() {
        const deskUrl = document.getElementById('bannerDeskInput')?.value;
        const mobileUrl = document.getElementById('bannerMobileInput')?.value;

        if (!deskUrl) {
            alert('Введите URL для десктопного баннера');
            return;
        }

        try {
            await updateSiteConfig({
                aboutText: aboutText,
                bannerDesk: deskUrl,
                bannerMobile: mobileUrl || banner.mobile
            });
            await loadAllData();
            alert('Баннер сохранён!');
            window.dispatchEvent(new Event('adminDataUpdated'));
        } catch (error) {
            console.error('Ошибка сохранения баннера:', error);
            alert('Ошибка при сохранении баннера');
        }
    }

    async function saveAbout() {
        const text = document.getElementById('aboutText')?.value;
        if (!text) {
            alert('Введите текст');
            return;
        }

        try {
            await updateSiteConfig({
                aboutText: text,
                bannerDesk: banner.desk,
                bannerMobile: banner.mobile
            });
            setAboutText(text);
            alert('Текст сохранён!');
            window.dispatchEvent(new Event('adminDataUpdated'));
        } catch (error) {
            console.error('Ошибка сохранения текста:', error);
            alert('Ошибка при сохранении текста');
        }
    }

    // ========== КОНТАКТЫ ==========
    async function saveContacts() {
        if (!contacts.email || !contacts.phone) {
            alert('Заполните email и телефон');
            return;
        }

        try {
            await updateContacts(contacts);
            alert('Контакты сохранены!');
            window.dispatchEvent(new Event('adminDataUpdated'));
        } catch (error) {
            console.error('Ошибка сохранения контактов:', error);
            alert('Ошибка при сохранении контактов');
        }
    }

    function updateBannerPreview() {
        const deskUrl = document.getElementById('bannerDeskInput')?.value;
        const previewImg = document.getElementById('bannerPreview');
        if (previewImg && deskUrl) {
            previewImg.src = deskUrl;
        }
    }

    function formatPhones(phones) {
        if (!phones) return 'Телефон не указан';
        if (Array.isArray(phones)) {
            if (phones.length === 0) return 'Телефон не указан';
            if (phones.length === 1) return phones[0];
            return `${phones[0]} +${phones.length - 1} еще`;
        }
        return phones;
    }

    if (loading) {
        return (
            <>
                <header className="admin-header">
                    <Link to="/" className="logo-link">
                        <div className="logo">
                            <img src={logo} alt="Логотип" className="logo-img" />
                        </div>
                    </Link>
                </header>
                <div className="admin-container">
                    <div className="loading-spinner">Загрузка данных из базы...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="admin-header">
                <Link to="/" className="logo-link">
                    <div className="logo">
                        <img src={logo} alt="Логотип" className="logo-img" />
                    </div>
                </Link>
                <button onClick={handleLogout} className="logout-btn">Выйти</button>
            </header>

            <div className="admin-container">
                <h1 className="admin-title">Админ-панель</h1>

                {/* Табы */}
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'taxis' ? 'active' : ''}`}
                        onClick={() => setActiveTab('taxis')}
                    >
                        Таксопарки
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('articles')}
                    >
                        Статьи
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Настройки
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contacts')}
                    >
                        Контакты
                    </button>
                </div>

                {/* Вкладка Таксопарки */}
                {activeTab === 'taxis' && (
                    <div className="admin-section">
                        <h2>Управление таксопарками</h2>

                        {/* Форма добавления/редактирования */}
                        <div className="form-card">
                            <h3>{editingTaxiId ? 'Редактировать таксопарк' : 'Добавить таксопарк'}</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Название *</label>
                                    <input
                                        type="text"
                                        value={newTaxi.name}
                                        onChange={e => setNewTaxi({ ...newTaxi, name: e.target.value })}
                                        placeholder="Такси Бобер"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Время подачи</label>
                                    <input
                                        type="text"
                                        value={newTaxi.time}
                                        onChange={e => setNewTaxi({ ...newTaxi, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Цена</label>
                                    <input
                                        type="text"
                                        value={newTaxi.price}
                                        onChange={e => setNewTaxi({ ...newTaxi, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Класс авто</label>
                                    <input
                                        type="text"
                                        value={newTaxi.class}
                                        onChange={e => setNewTaxi({ ...newTaxi, class: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Поля для телефонов */}
                            <div className="form-group">
                                <label>Телефоны *</label>
                                {newTaxi.phones.map((phone, index) => (
                                    <div key={index} className="phone-input-group">
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => updatePhone(index, e.target.value)}
                                            placeholder="+7 (800) 555-35-35"
                                            className="phone-input"
                                        />
                                        {index === newTaxi.phones.length - 1 && (
                                            <button type="button" onClick={addPhoneField} className="add-phone-btn" title="Добавить телефон">
                                                <FiPlus size={18} />
                                            </button>
                                        )}
                                        {newTaxi.phones.length > 1 && (
                                            <button type="button" onClick={() => removePhoneField(index)} className="remove-phone-btn" title="Удалить телефон">
                                                <FiX size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <small>Можно добавить несколько номеров телефонов</small>
                            </div>

                            <div className="form-group">
                                <label>Полное описание</label>
                                <textarea
                                    rows="4"
                                    value={newTaxi.description}
                                    onChange={e => setNewTaxi({ ...newTaxi, description: e.target.value })}
                                    placeholder="Полное описание таксопарка..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button onClick={saveTaxi} className="admin-btn success">
                                    {editingTaxiId ? 'Сохранить изменения' : 'Добавить таксопарк'}
                                </button>
                                {editingTaxiId && (
                                    <button onClick={resetTaxiForm} className="admin-btn" style={{ background: '#666' }}>
                                        Отменить
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Список таксопарков */}
                        <div className="items-list">
                            <h3>Список таксопарков ({taxis.length})</h3>
                            <div className="items-grid">
                                {taxis.length === 0 ? (
                                    <div className="empty-message">Нет добавленных таксопарков</div>
                                ) : (
                                    taxis.map(taxi => (
                                        <div key={taxi.id} className="item-card">
                                            <div className="item-info">
                                                <div className="item-name"><FaTaxi size={14} /> {taxi.name}</div>
                                                <div className="item-detail">
                                                    <FiPhone size={10} /> {formatPhones(taxi.phones || taxi.phone)} | <FiClock size={10} /> {taxi.time} | <FaMoneyBillWave size={10} /> {taxi.price}
                                                </div>
                                                <div className="item-class"><FaCar size={12} /> {taxi.class}</div>
                                            </div>
                                            <div className="item-actions">
                                                <button onClick={() => startEditTaxi(taxi)} className="edit-btn">
                                                    Редактировать
                                                </button>
                                                <button onClick={() => deleteTaxiItem(taxi.id)} className="delete-btn">
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Вкладка Статьи */}
                {activeTab === 'articles' && (
                    <div className="admin-section">
                        <h2>Управление статьями</h2>

                        {/* Форма добавления */}
                        <div className="form-card">
                            <h3>Добавить статью</h3>
                            <div className="form-group">
                                <label>Заголовок статьи *</label>
                                <input
                                    type="text"
                                    value={newArticle.title}
                                    onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                                    placeholder="Как выбрать такси"
                                />
                            </div>
                            <div className="form-group">
                                <label>Полное содержание статьи</label>
                                <textarea
                                    rows="5"
                                    value={newArticle.content}
                                    onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                                    placeholder="Полный текст статьи..."
                                />
                            </div>
                            <div className="form-group">
                                <label>URL картинки для статьи</label>
                                <input
                                    type="text"
                                    value={newArticle.image}
                                    onChange={e => setNewArticle({ ...newArticle, image: e.target.value })}
                                    placeholder="https://placehold.co/500x300"
                                />
                            </div>
                            <button onClick={addArticle} className="admin-btn success">Добавить статью</button>
                        </div>

                        {/* Список статей */}
                        <div className="items-list">
                            <h3>Список статей ({articles.length})</h3>
                            <div className="items-grid">
                                {articles.length === 0 ? (
                                    <div className="empty-message">Нет добавленных статей</div>
                                ) : (
                                    articles.map(article => (
                                        <div key={article.id} className="item-card">
                                            <div className="item-info">
                                                <div className="item-name">{article.title}</div>
                                                <div className="item-detail">
                                                    {article.content?.substring(0, 100)}...
                                                </div>
                                                <div className="item-date">{article.date}</div>
                                            </div>
                                            <button onClick={() => deleteArticleItem(article.id)} className="delete-btn">
                                                Удалить
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Вкладка Настройки */}
                {activeTab === 'settings' && (
                    <>
                        <div className="admin-section">
                            <h2>Баннер</h2>
                            <div className="form-group">
                                <label>Ссылка на картинку баннера (десктоп 800x100)</label>
                                <input
                                    type="text"
                                    id="bannerDeskInput"
                                    defaultValue={banner.desk}
                                    onInput={updateBannerPreview}
                                />
                                <small>Рекомендуемый размер: 800x100px</small>
                            </div>
                            <div className="form-group">
                                <label>Ссылка на картинку баннера (мобильный 300x100)</label>
                                <input
                                    type="text"
                                    id="bannerMobileInput"
                                    defaultValue={banner.mobile}
                                />
                                <small>Рекомендуемый размер: 300x100px</small>
                            </div>
                            <button onClick={saveBanner} className="admin-btn">Сохранить баннер</button>
                            <div className="preview-block">
                                <p>Предпросмотр:</p>
                                <img id="bannerPreview" src={banner.desk} alt="Превью баннера" />
                            </div>
                        </div>

                        <div className="admin-section">
                            <h2>Страница «О проекте»</h2>
                            <div className="form-card">
                                <div className="form-group">
                                    <label>Текст на странице «О проекте»</label>
                                    <textarea
                                        id="aboutText"
                                        defaultValue={aboutText}
                                        rows="8"
                                        onChange={(e) => setAboutText(e.target.value)}
                                    />
                                </div>
                                <button onClick={saveAbout} className="admin-btn">Сохранить текст</button>
                            </div>
                        </div>
                    </>
                )}

                {/* Вкладка Контакты */}
                {activeTab === 'contacts' && (
                    <div className="admin-section">
                        <h2><FiPhone size={18} /> Управление контактами</h2>
                        <div className="form-card">
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={contacts.email}
                                    onChange={e => setContacts({ ...contacts, email: e.target.value })}
                                    placeholder="info@taxi-city.ru"
                                />
                            </div>
                            <div className="form-group">
                                <label>Телефон *</label>
                                <input
                                    type="text"
                                    value={contacts.phone}
                                    onChange={e => setContacts({ ...contacts, phone: e.target.value })}
                                    placeholder="+7 (800) 123-45-67"
                                />
                            </div>
                            <div className="form-group">
                                <label>Адрес</label>
                                <input
                                    type="text"
                                    value={contacts.address || ''}
                                    onChange={e => setContacts({ ...contacts, address: e.target.value })}
                                    placeholder="г. Волхов, ул. Ленина, 1"
                                />
                            </div>
                            <div className="form-group">
                                <label>Режим работы</label>
                                <input
                                    type="text"
                                    value={contacts.workHours || ''}
                                    onChange={e => setContacts({ ...contacts, workHours: e.target.value })}
                                    placeholder="Круглосуточно"
                                />
                            </div>
                            <button onClick={saveContacts} className="admin-btn">Сохранить контакты</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminPage;
