import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiArrowLeft } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import { getArticleById, getSiteConfig } from '../services/api';
import '../css/ArticlePage.css';

function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [banner, setBanner] = useState({ desk: '', mobile: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            setLoading(true);
            const [articleData, configData] = await Promise.all([
                getArticleById(id),
                getSiteConfig()
            ]);
            setArticle(articleData);
            setBanner({
                desk: configData.bannerDesk,
                mobile: configData.bannerMobile
            });
        } catch (error) {
            console.error('Ошибка загрузки статьи:', error);
            setArticle(null);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className="main">
                    <div className="loading-spinner">Загрузка статьи...</div>
                </main>
                <Footer />
            </>
        );
    }

    if (!article) {
        return (
            <>
                <Header />
                {banner.desk && <Banner deskUrl={banner.desk} mobileUrl={banner.mobile} />}
                <main className="main">
                    <div className="article-card">
                        <h1 className="article-title">Статья не найдена</h1>
                        <Link to="/articles" className="back-link"><FiArrowLeft size={14} /> Назад к списку статей</Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            {banner.desk && <Banner deskUrl={banner.desk} mobileUrl={banner.mobile} />}
            <main className="main">
                <div className="article-card">
                    <h1 className="article-title">{article.title}</h1>
                    <div className="article-content">
                        <div className="article-text">
                            {article.content.split('\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>
                        {article.image && (
                            <div className="article-image">
                                <img src={article.image} alt={article.title} />
                            </div>
                        )}
                    </div>
                    <div className="article-footer-note">
                        <p><FiCalendar size={14} /> {article.date}</p>
                        <Link to="/articles" className="back-link"><FiArrowLeft size={14} /> Назад к списку статей</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ArticlePage;
