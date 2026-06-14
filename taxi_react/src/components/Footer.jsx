import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-links">
                <Link to="/about">О проекте</Link>
                <Link to="/contacts">Контакты</Link>
                <Link to="/articles">Статьи</Link>
            </div>
        </footer>
    );
}

export default Footer;