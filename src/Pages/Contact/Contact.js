import React from 'react';
import ContactForm from './ContactForm.js';
import Header from './Contact_Header.js';
import SocialLinks from './SocialLinks.js';
import './Contact.css'
import Navbar from '../Index/components/Navbar.js';

const App = () => {
    return (
        <div>
            <Navbar />
            <Header />
            <ContactForm />
            <SocialLinks />
        </div>
    );
}

export default App;
