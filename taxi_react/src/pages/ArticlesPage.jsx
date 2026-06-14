import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import ArticleCard from '../components/ArticleCard';
import { getArticles, getSiteConfig } from '../services/api';
import '../css/ArticlesPage.css';

function ArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [banner, setBanner] = useState({ desk: '', mobile: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [articlesData, configData] = await Promise.all([
                getArticles(),
                getSiteConfig()
            ]);
            setArticles(articlesData);
            setBanner({
                desk: configData.bannerDesk,
                mobile: configData.bannerMobile
            });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className="main">
                    <div className="loading-spinner">Загрузка статей...</div>
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
                <div className="articles-card">
                    <h1 className="articles-title">Статьи</h1>
                    <div className="articles-list">
                        {articles.length === 0 ? (
                            <p>Статьи пока не добавлены</p>
                        ) : (
                            articles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ArticlesPage;
