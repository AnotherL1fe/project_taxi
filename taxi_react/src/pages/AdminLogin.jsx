import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import logo from '../images/logo_taxi.png';
import { adminLogin } from '../services/api';
import '../css/AdminLogin.css';

function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await adminLogin(password);
            if (result.success) {
                sessionStorage.setItem('adminAuthenticated', 'true');
                navigate('/admin');
            } else {
                setError('Неверный пароль!');
                setPassword('');
            }
        } catch (err) {
            setError(err.message || 'Ошибка при входе. Попробуйте позже.');
            setPassword('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="admin-header">
                <Link to="/" className="logo-link">
                    <div className="logo">
                        <img src={logo} alt="Логотип" className="logo-img" />
                    </div>
                </Link>
            </header>

            <main className="main">
                <div className="login-card">
                    <h1 className="login-title"><FiLock size={24} /> Вход в админ-панель</h1>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Пароль</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                                autoFocus
                                disabled={loading}
                            />
                        </div>
                        {error && <div className="login-error">{error}</div>}
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Проверка...' : 'Войти'}
                        </button>
                    </form>
                </div>
            </main>

            <footer className="footer">
                <div className="footer-links">
                    <Link to="/about">О проекте</Link>
                    <Link to="/contacts">Контакты</Link>
                    <Link to="/articles">Статьи</Link>
                </div>
            </footer>
        </>
    );
}

export default AdminLogin;