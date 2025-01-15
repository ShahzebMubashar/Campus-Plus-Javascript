// App.js
import React from "react";
import "./PP.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const papers = [
    {
        title: "Linear Algebra",
        code: "LA",
        description:
            "Linear algebra explores vector spaces, linear transformations, and matrix operations. It’s essential for solving systems of linear equations, performing data analysis, and applications in computer graphics, optimization, and machine learning.",
    },
    {
        title: "Calculus & Analytical Geometry",
        code: "Cal",
        description:
            "Calculus involves derivatives and integrals to analyze change and accumulation, while analytical geometry uses algebraic equations to study geometric shapes and their properties in coordinate systems, bridging algebra and geometry.",
    },
    {
        title: "Computer Networks",
        code: "CN",
        description:
            "Computer networks connect devices for data sharing and communication, using protocols and topologies. They enable resource sharing, efficient data transfer, and ensure network security and reliability.",
    },
    {
        title: "Artificial Intelligence",
        code: "AI",
        description:
            "Artificial intelligence explores the simulation of human intelligence in machines. It includes machine learning, natural language processing, and robotics applications.",
    },
    {
        title: "Data Structures",
        code: "DS",
        description:
            "Data structures are ways to organize and store data efficiently for access and modification. They are fundamental in algorithms and system design.",
    },
    {
        title: "Operating Systems",
        code: "OS",
        description:
            "Operating systems manage hardware and software resources, providing services for computer programs. Key concepts include process management, memory allocation, and file systems.",
    },
];

function App() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        nextArrow: <button className="pastpapers-arrow pastpapers-next">&gt;</button>,
        prevArrow: <button className="pastpapers-arrow pastpapers-prev">&lt;</button>,
    };

    return (
        <div className="pastpapers-app">
            <header className="pastpapers-header">
                <h1>All Past Papers</h1>
                <p>Last-minute prep? No stress! Past papers hain, bas parho aur ace it!</p>
            </header>
            <section className="pastpapers-trending">
                <h2>Trending Papers</h2>
                <Slider {...settings}>
                    {papers.map((paper, index) => (
                        <div key={index} className="pastpapers-card">
                            <h3>{paper.title}</h3>
                            <h4>({paper.code})</h4>
                            <p>{paper.description}</p>
                        </div>
                    ))}
                </Slider>
            </section>
        </div>
    );
}

export default App;
