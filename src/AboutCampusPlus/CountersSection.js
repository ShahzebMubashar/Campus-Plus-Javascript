import React from 'react';

const CountersSection = () => {
    const counters = [
        { count: '4999+', text: 'Happy Users' },
        { count: '200+', text: 'Past Papers' },
        { count: '130+', text: 'Youtube Tutorials' },
        { count: '4005+', text: 'Teachers Signed Up' },
    ];

    return (
        <section className="bg-cover" style={{ backgroundImage: 'url(../assets/images/cover_2.webp)' }}>
            <div className="overlay"></div>
            <div className="container text-white text-center">
                <div className="row gy-4" data-aos="fade-up">
                    {counters.map((item, index) => (
                        <div className="col-md-3" key={index}>
                            <h1 className="mt-3 mb-2">{item.count}</h1>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CountersSection;
