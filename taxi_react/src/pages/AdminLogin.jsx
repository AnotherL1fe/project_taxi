import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import logo from '../images/logo_taxi.png';
import '../css/AdminLogin.css';

function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const ADMIN_PASSWORD = 'admin123';

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Неверный пароль!');
            setPassword('');
        }
    };

    return (
        <>
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="Логотип" className="logo-img" />
                </div>
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
                            />
                        </div>
                        {error && <div className="login-error">{error}</div>}
                        <button type="submit" className="login-btn">Войти</button>
                    </form>
                </div>
            </main>

            <footer className="footer">
                <div className="footer-links">
                    <a href="/about">О проекте</a>
                    <a href="/contacts">Контакты</a>
                    <a href="/articles">Статьи</a>
                </div>
            </footer>
        </>
    );
}

export default AdminLogin;
