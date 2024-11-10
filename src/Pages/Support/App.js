import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './support.css'; // Import the custom CSS for styling

// Import individual components
import Header from './components/Header';
import Loader from './components/Loader';
import IntroSection from './components/IntroSection';
import FAQSection from './components/FAQSection';
import AssistantSection from './components/AssistantSection';
import ArticlesSection from './components/ArticlesSection';
import BackToTopButton from './components/BackToTopButton';
import Footer from './components/Footer';

function App() {
    return (
        <div>
            <Header />
            <Loader />
            <IntroSection />
            <FAQSection />
            <AssistantSection />
            <ArticlesSection />
            <BackToTopButton />
            <Footer />
        </div>
    );
}

export default App;
