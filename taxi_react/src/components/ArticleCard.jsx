import { Link } from 'react-router-dom';
import { FiFile, FiArrowRight } from 'react-icons/fi';

function ArticleCard({ article }) {
    return (
        <Link to={`/article/${article.id}`} className="article-link">
            <span className="article-icon"><FiFile size={24} /></span>
            <span className="article-name">{article.title}</span>
            <span className="article-arrow"><FiArrowRight size={20} /></span>
        </Link>
    );
}

export default ArticleCard;