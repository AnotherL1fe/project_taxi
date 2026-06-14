import { Link } from 'react-router-dom';
import { FiPhone } from 'react-icons/fi';

function TaxiCard({ taxi }) {
    return (
        <div className="taxi-card">
            <h2>
                <Link to={`/taxi/${taxi.id}`} className="taxi-link">
                    {taxi.name}
                </Link>
            </h2>
            <ul>
                <li>Подача {taxi.time}</li>
                <li>Стоимость {taxi.price}</li>
                <li>{taxi.class}</li>
            </ul>
            <a href={`tel:${taxi.phone}`} className="phone-btn"><FiPhone size={14} /> Телефон</a>
        </div>
    );
}

export default TaxiCard;