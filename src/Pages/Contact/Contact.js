import React from 'react';
import ContactForm from './ContactForm';
import Header from './Contact_Header';
import SocialLinks from './SocialLinks';
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
