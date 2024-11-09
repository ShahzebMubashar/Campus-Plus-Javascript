// src/App.js
import React from "react";
import Header from "./Index/components/Header";
import Loader from "./Index/components/Loader";
import MainContent from "./Index/components/MainContent";
import Features from "./Index/components/Features";
import Courses from "./Index/components/Courses";
import Testimonials from "./Index/components/Testimonials";
import Footer from "./Index/components/Footer";
import "./styles.css"; // Add main CSS file here

function App() {
  return (
    <div className="App">
      <Loader />
      <Header />
      <MainContent />
      <Features />
      <Courses />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
