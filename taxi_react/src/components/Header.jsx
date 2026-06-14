import { Link } from 'react-router-dom';
import logo from '../images/logo_taxi.png';

function Header() {
    return (
        <header className="header">
            <Link to="/" className="logo-link">
                <div className="logo">
                    <img src={logo} alt="Логотип" className="logo-img" />
                </div>
            </Link>
        </header>
    );
}

export default Header;