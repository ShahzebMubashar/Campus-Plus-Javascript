import React, { useState, useEffect } from "react";
import "./PP.css"; // Assuming CSS is applied separately
import SearchBar from "./PastPapers_SearchBar";
import PaperItem from "./PaperItem";
import Testimonial_Carousel from "./Testimonial_Carousel";

const items = [
    {
        heading: "Accounting and Finance (AF)",
        para: "Accounting and finance involve recording and analyzing financial transactions to ensure accurate records, regulatory compliance, and informed business decisions, essential for growth and financial health.",
        link: "../html/Papers/AccountingAndFinance.html",
        rating: 5.0,
        badge: "easy",
        ratingLink: "../html/playlist.html",
    },
    {
        heading: "Advanced Computer Architecture (ACA)",
        para: "Advanced Computer Architecture (ACA) focuses on optimizing computer systems for enhanced performance through efficient hardware and software integration. It includes parallel processing and memory hierarchy concepts.",
        link: "../html/Papers/AdvancedComputerArchitecture.html",
        rating: 4.2,
        badge: "medium",
        ratingLink: "../html/playlist.html",
    },
    // More items...
];

const PastPapers = () => {
    const [displayItems, setDisplayItems] = useState(items.slice(0, 12));
    const [searchText, setSearchText] = useState("");

    const loadMore = () => {
        setDisplayItems(items.slice(0, displayItems.length + 12));
    };

    const filterItems = (text) => {
        const filtered = items.filter(item =>
            item.heading.toLowerCase().includes(text.toLowerCase())
        );
        setDisplayItems(filtered.length > 0 ? filtered : []);
    };

    useEffect(() => {
        filterItems(searchText);
    }, [searchText]);

    return (
        <div id="past-papers">
            <SearchBar onSearch={(e) => setSearchText(e.target.value)} />
            <div id="container">
                {displayItems.map((item, index) => (
                    <PaperItem key={index} item={item} />
                ))}
                {displayItems.length === 0 && (
                    <div className="error-message">No courses found matching your search criteria.</div>
                )}
            </div>
            {displayItems.length < items.length && (
                <button id="viewMoreBtn" onClick={loadMore}>
                    Load More
                </button>
            )}

        </div>
    );
};

export default PastPapers;
