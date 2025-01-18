import React, { useState, useEffect } from 'react';
import './faculty.css';
import Navbar from '../Index/components/Navbar';

// Define the slowScrollTo function
const slowScrollTo = (targetPosition, duration) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    // Easing function for smooth scrolling
    const ease = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
};


const FacultySection = () => {
    const [menuActive, setMenuActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFaculty, setFilteredFaculty] = useState(facultyData);

    useEffect(() => {
        // Smooth scroll setup
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    slowScrollTo(targetElement.offsetTop, 1000); // 1000ms = 1 second
                }
            });
        });

        // Scroll progress setup
        const progressCircle = document.querySelector('.progress-ring__circle');
        const radius = progressCircle ? progressCircle.r.baseVal.value : 0;
        const circumference = 2 * Math.PI * radius;

        if (progressCircle) {
            progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            progressCircle.style.strokeDashoffset = circumference;
        }

        const updateProgress = () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            setProgress(scrollPercent, circumference);
        };

        const setProgress = (percent, circumference) => {
            const offset = circumference - (percent / 100 * circumference);
            if (progressCircle) {
                progressCircle.style.strokeDashoffset = offset;
            }
        };

        window.onscroll = updateProgress;
        updateProgress();

        return () => {
            window.onscroll = null; // Cleanup on component unmount
        };
    }, []);

    useEffect(() => {
        const handleSearch = () => {
            const query = searchQuery.toLowerCase();
            const filtered = Object.keys(facultyData).reduce((acc, school) => {
                const filteredFacultyList = facultyData[school].filter(faculty =>
                    faculty.name.toLowerCase().includes(query)
                );
                if (filteredFacultyList.length > 0) {
                    acc[school] = filteredFacultyList;
                }
                return acc;
            }, {});
            setFilteredFaculty(filtered);
        };

        handleSearch();
    }, [searchQuery]);

    return (
        <main>
            <Navbar />
            <IntroSection />
            <SchoolsContainer />
            <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <NoResultsMessage filteredFaculty={filteredFaculty} />
            <FacultyContainers filteredFaculty={filteredFaculty} />
            <ScrollToTopButton />
        </main>
    );
};

const IntroSection = () => (
    <section className="intro-section" style={{ marginTop: '100px' }}>
        <h1>Faculty Information</h1>
        <p>Need to find your prof? Names, offices, emails—sab kuch yahan milega</p>
    </section>
);

const SchoolsContainer = () => (
    <div className="schools-container">
        {['EE', 'CV', 'CS', 'M', 'SH'].map((school, index) => (
            <a href={`#${school}`} key={index}>
                <div className="school-box">{`FAST School of ${school}`}</div>
            </a>
        ))}
    </div>
);

const SearchSection = ({ searchQuery, setSearchQuery }) => (
    <section className="search-section">
        <div className="search-bar">
            <input
                type="text"
                id="searchInput"
                placeholder="Search for a teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button">
                <i className="fas fa-search"></i>
            </button>
        </div>
    </section>
);

const NoResultsMessage = ({ filteredFaculty }) => (
    <div
        id="noResultsMessage"
        className="no-results"
        style={{ display: Object.keys(filteredFaculty).length ? 'none' : 'block' }}
    >
        No results containing all your search terms were found.
        <p></p>
        <ul>
            <li>Make sure that all words are spelled correctly.</li>
            <li>Try different keywords.</li>
            <li>Try more general keywords.</li>
        </ul>
    </div>
);

const FacultyContainers = ({ filteredFaculty }) => (
    <>
        {Object.entries(filteredFaculty).map(([school, facultyList]) => (
            <FacultyContainer key={school} id={school} schoolName={`FAST School of ${school}`} facultyList={facultyList} />
        ))}
    </>
);

const FacultyContainer = ({ id, schoolName, facultyList }) => (
    <div className="faculty-container" id={id}>
        <h1 className="School-name">{schoolName}</h1>
        <div className="faculty-grid" id="facultyGrid">
            {facultyList.map((faculty, index) => (
                <FacultyCard key={index} faculty={faculty} />
            ))}
        </div>
    </div>
);

const FacultyCard = ({ faculty }) => {
    const copyEmail = (email) => {
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);

        tempInput.select();
        document.execCommand("copy");

        document.body.removeChild(tempInput);
    };

    return (
        <div className="faculty-card">
            <img src={faculty.image} alt={faculty.name} loading="lazy" />
            <h3>{faculty.name}</h3>
            <p>{faculty.position}</p>
            <p>{faculty.office}</p>
            <p className="contact-info">
                <span className="email">{faculty.email}</span>
                <i
                    className="fa-regular fa-copy copy-icon"
                    style={{ cursor: 'pointer' }}
                    onClick={() => copyEmail(faculty.email)}
                ></i>
            </p>
        </div>
    );
};

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (document.documentElement.scrollTop > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.onscroll = handleScroll;

        return () => window.onscroll = null; // Cleanup on component unmount
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            id="myBtn"
            className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
            onClick={scrollToTop}
        >
            ↑
        </button>
    );
};

const facultyData = {
    CS: [
        {
            name: 'Dr. Kashif Zafar',
            position: 'Professor & HOD',
            office: 'F-Block, 1st floor (Adjacent Academic Office)',
            email: 'kashif.zafar@nu.edu.pk',
            image: '../assets/faculty images/CS Faculty/dr. kasif zafar.webp',
        },
        {
            name: 'Dr. Aamir Wali',
            position: 'Professor & HOD',
            office: 'F-Block, 1st floor (Adjacent HOD\'s Office)',
            email: 'aamir.wali@nu.edu.pk',
            image: '../assets/faculty images/CS Faculty/dr. amir wali.webp',
        },
        {
            name: 'Dr. Asif Mahmood Gillani',
            position: 'Professor',
            office: 'F-Block, 1st floor, Room 10 (NB-F-010)',
            email: 'asif.gilani@nu.edu.pk',
            image: '../assets/faculty images/CS Faculty/dr. asif mahmood gilani.webp',
        },
        {
            name: 'Dr. Zareen Alamgir',
            position: 'Professor',
            office: 'F-Block, 1st floor, Room 12 (NB-F-012)',
            email: 'zareen.alamgir@nu.edu.pk',
            image: '../assets/faculty images/CS Faculty/dr. zareen alamgir.webp',
        },
        {
            name: 'Dr. Arshad Ali',
            position: 'Associate Professor',
            office: 'A-Block, Ground floor, Room 140 (C-140)',
            email: 'arshad.ali1@nu.edu.pk',
            image: '../assets/faculty images/CS Faculty/dr. arshad ali.webp',
        },
        {
            name: 'Dr. Asma Naseer',
            position: 'Associate Professor',
            office: 'F-Block, 1st floor, Room 11 (NB-F-011)',
            email: 'asma.naseer@nu.edu.pk',
            image: '../assets/faculty images/CS Faculty/dr. asma naseer.webp',
        },
    ],
    EE: [
        {
            name: 'Dr. Saima Zafar',
            position: 'Professor & HOD',
            office: 'D-Block, 1st floor (Academic Office EE)',
            email: 'saima.zafar@nu.edu.pk',
            image: '../assets/faculty images/EE Faculty/dr. saima zafar.webp',
        },
        {
            name: 'Dr. S.M. Sajid',
            position: 'Professor',
            office: 'E-Block, 1st floor, Room 01 (Library 1st Floor)',
            email: 'sm.sajid@nu.edu.pk',
            image: '../assets/faculty images/EE Faculty/dr. s m sajid.webp',
        },
        {
            name: 'Dr. Syed Aun Abbas',
            position: 'Professor',
            office: 'E-Block, 1st floor, Room 01 (Library 1st Floor)',
            email: 'aun.abbas@nu.edu.pk',
            image: '../assets/faculty images/EE Faculty/dr. syed aun abbas.webp',
        },
        {
            name: 'Dr. Omer Saleem',
            position: 'Associate Professor',
            office: 'A-Block, Ground floor, Room 140 (C-140)',
            email: 'omer.saleem@nu.edu.pk',
            image: '../assets/faculty images/EE Faculty/dr. omer saleem.webp',
        },
        {
            name: 'Dr. Jabran Khan',
            position: 'Assistant Professor',
            office: 'A-Block, Ground floor, Room 140 (C-140)',
            email: 'jabran.khan@nu.edu.pk',
            image: '../assets/faculty images/EE Faculty/dr. jabran khan.webp',
        },
        {
            name: 'Dr. Kashif Saeed',
            position: 'Assistant Professor',
            office: 'A-Block, Ground floor, Room 138 (C-138)',
            email: 'kashif.saeed@nu.edu.pk',
            image: '../assets/faculty images/EE Faculty/dr. kashif saeed.webp',
        },
    ],
    CV: [
        {
            name: 'Dr. Tauqir Ahmed',
            position: 'Associate Professor & HOD',
            office: 'A-Block, 1st Floor (Academic Office CV)',
            email: 'tauqir.ahmed@nu.edu.pk',
            image: '../assets/faculty images/CV Faculty/dr. tauqir ahmed.webp',
        },
        {
            name: 'Dr. Shahid Ali',
            position: 'Professor',
            office: 'A-Block, Ground floor, Room 132',
            email: 'shahid.ali@nu.edu.pk',
            image: '../assets/faculty images/CV Faculty/dr. shahid ali.webp',
        },
    ],
};

export default FacultySection;
