import React from 'react';

const ContributorsSection = () => {
    const contributors = [
        {
            id: 1,
            name: "Muhammad Mujtaba",
            image: "../assets/images/mujtaba.webp",
            description: "Muhammad Mujtaba's coding expertise and experience played a crucial role in building the robust foundation of Campus+.",
            profileUrl: "https://mmujtabah.vercel.app/"
        },
        {
            id: 2,
            name: "Taha Iqbal",
            image: "../assets/images/taha.webp",
            description: "Taha Iqbal's sharp coding skills and strong foundation in logic were essential in building the core features of Campus+.",
            profileUrl: "https://tahaiqbal31.github.io/Personal-Portfolio/"
        },
        {
            id: 3,
            name: "Ammar Zia",
            image: "../assets/images/Ammar Profile.webp",
            description: "Ammar's creativity, combined with his technical skills, brought fresh ideas that greatly contributed to the development of Campus+.",
            profileUrl: "https://ammarnoorzia.github.io/aammarofficial.github.io/"
        },
        {
            id: 4,
            name: "Harris Tabassum",
            image: "../assets/images/Harris Profile.webp",
            description: "Harris's adaptability and deep understanding of tasks, combined with his skills, were key in effectively executing Campus+ features.",
            profileUrl: "https://mharrist.github.io/MyPortfolio/"
        },
        {
            id: 5,
            name: "Sarah Khan",
            image: "../assets/images/mujtaba.webp",
            description: "Sarah's expertise in UX design and user research was instrumental in creating the intuitive and user-friendly interface of Campus+.",
            profileUrl: "#"
        },
        {
            id: 6,
            name: "Ahmed Ali",
            image: "../assets/images/taha.webp",
            description: "Ahmed's backend development skills and database expertise ensured Campus+ had a reliable and scalable infrastructure.",
            profileUrl: "#"
        }
    ];

    return (
        <section id="contributors" className="bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-12 section-intro text-center" data-aos="fade-up">
                        <h1>Campus+ would have been nothing without</h1>
                        <div className="divider"></div>
                    </div>
                </div>

                <div className="row">
                    {contributors.map(contributor => (
                        <div key={contributor.id} className="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
                            <div className="service shadow-lg p-4 rounded text-center h-100">
                                <img
                                    src={contributor.image}
                                    className="imageround1"
                                    alt={contributor.name}
                                />
                                <div className="mt-4">
                                    <h5 className="mt-2 mb-2">
                                        <a href="#">{contributor.name}</a>
                                    </h5>
                                    <p className="contributor-description">
                                        {contributor.description}
                                    </p>
                                    <a href={contributor.profileUrl} className="visit-profile-link">
                                        Visit Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContributorsSection;
