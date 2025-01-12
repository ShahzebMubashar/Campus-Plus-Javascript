import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import './FAQSection.css';

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

const FAQSection = () => {
    const [activeFAQ, setActiveFAQ] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');

    const faqs = [
        {
            question: "How can I get help if I'm struggling with a subject?",
            answer:
                'Stay engaged during lectures, actively seek assistance from instructors during office hours, participate in study groups, and utilize online resources to enhance your understanding. The two simple tips are to stay consistent and do your assignments yourself.',
        },
        {
            question: 'How do I contact my professors?',
            answer:
                'You can contact your professors via their university email. Office hours are also available for in-person meetings, and the times are usually listed in the course syllabus. You can also view the faculty info on our website and get their office location and meet them physically.',
        },
        {
            question: 'How can I report the bugs on this website?',
            answer:
                'You can send us any bugs on our email <strong>productionsbymultidexters@gmail.com</strong>. You are requested to email us with a screenshot of the bug and we will fix it promptly.',
        },
    ];

    // Create Fuse.js instance once
    const fuse = useMemo(() => {
        return new Fuse(faqs, {
            keys: ['question', 'answer'],
            threshold: 0.3,
        });
    }, []);

    useEffect(() => {
        const loadExternalScripts = async () => {
            try {
                await loadScript('https://cdn.jsdelivr.net/npm/fuse.js@6.5.3');
                console.log('Fuse.js loaded');
                await loadScript('https://cdn.vercel-insights.com/v1/script.js');
                console.log('Vercel Insights loaded');
            } catch (error) {
                console.error('Error loading external scripts:', error);
            }
        };

        loadExternalScripts();
    }, []);

    useEffect(() => {
        if (query) {
            const results = fuse.search(query).map((result) => result.item);
            setSearchResults(results);
        } else {
            setSearchResults(faqs);
        }
    }, [query, fuse]); // Use memoized fuse instance

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    return (
        <section className="faq">
            <h2>Frequently Asked Questions (FAQs)</h2>

            {searchResults.map((faq, index) => (
                <div
                    className={`faq-item ${activeFAQ === index ? 'active' : ''}`}
                    key={index}
                >
                    <button className="faq-question" onClick={() => toggleFAQ(index)}>
                        {faq.question} <span className="arrow">{activeFAQ === index ? '-' : '+'}</span>
                    </button>
                    <div
                        className="faq-answer"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                </div>
            ))}
        </section>
    );
};

export default FAQSection;
