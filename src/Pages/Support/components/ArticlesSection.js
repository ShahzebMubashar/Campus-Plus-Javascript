import React from 'react';

const ArticlesSection = () => (
    <section className="featured-articles">
        <h2 className="text-center">Recommended Articles</h2>
        <div className="articles">
            {/* Map through articles dynamically if needed */}
            <div className="article">
                <a href="https://thebrainbytes.blogspot.com/">
                    <img src="../assets/images/Data Science vs. Statistics_ Unraveling the Mysteries of Modern Analytics.webp" alt="Data Science vs. Statistics" />
                    <h3>Data Science vs. Statistics: Unraveling the Mysteries</h3>
                    <p>Discover the key differences between data science and statistics.</p>
                </a>
            </div>
        </div>
    </section>
);

export default ArticlesSection;
