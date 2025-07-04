import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Past Papers",
      icon: "icon-tools",
      href: "pastpapers.html",
      text: "Browse through a comprehensive collection of past papers to enhance your exam preparation and boost your performance.",
    },
    {
      title: "CGPA Calculators",
      icon: "icon-browser",
      href: "calculator.html",
      text: "Effortlessly calculate your CGPA using our user-friendly tool to keep track of your academic progress.",
    },
    {
      title: "Youtube Playlist",
      icon: "icon-calendar",
      href: "pastpapers.html",
      text: "Discover educational YouTube playlists with valuable content to support and enrich your learning experience.",
    },
    {
      title: "Faculty Info",
      icon: "icon-camera",
      href: "calculator.html",
      text: "Access detailed information about faculty members to connect and engage with your professors and mentors.",
    },
    {
      title: "Student Support",
      icon: "icon-scissors",
      href: "pastpapers.html",
      text: "Utilize our dedicated student support resources to get assistance and resolve any academic or administrative issues.",
    },
    {
      title: "Time Table Generator",
      icon: "icon-strategy",
      href: "calculator.html",
      text: "Create and manage your personal timetable efficiently with our easy-to-use timetable generator for a well-organized schedule.",
    },
  ];

  return (
    <section id="features" className="text-center">
      <div className="container">
        <div className="row">
          <div className="col-12 section-intro text-center" data-aos="fade-up">
            <div className="divider"></div>
            <h1>What Campus+ offers?</h1>
            <p>
              Campus+ offers a comprehensive suite of tools including faculty
              information, GPA calculators, past papers, university news,
              timetable generators, and more, all designed to support your
              academic journey.
            </p>
          </div>
        </div>
        <div className="row gx-4 gy-5">
          {features.map((feature, index) => (
            <a
              href={feature.href}
              className="col-md-4 feature-link"
              data-aos="fade-up"
              key={index}
            >
              <div className="feature">
                <div className="icon">
                  <i className={feature.icon}></i>
                </div>
                <h5 className="mt-4 mb-3">{feature.title}</h5>
                <p>{feature.text}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
