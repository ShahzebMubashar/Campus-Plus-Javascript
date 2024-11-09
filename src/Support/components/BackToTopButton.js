import React from 'react';

const BackToTopButton = () => {
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id="myBtnContainer" onClick={handleScrollToTop}>
            <button id="myBtn" title="Go to top">
                <i className="fas fa-rocket" />
            </button>
        </div>
    );
};

export default BackToTopButton;
