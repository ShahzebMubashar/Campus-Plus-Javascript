import React from 'react';
import ContactForm from './ContactForm.js';
import Header from './Contact_Header.js';
import SocialLinks from './SocialLinks.js';
import './Contact.css'

const App = () => {
    return (
        <div>
            <Header />
            <ContactForm />
            <SocialLinks />
        </div>
    );
}

export default App;
