import React from 'react';

const AssistantSection = () => (
    <section className="generator-container">
        <h2>Your Personal Assistant</h2>
        <div className="card-container">
            {/* Replace with dynamically generated cards if needed */}
            <div className="card">
                <div className="card-image">
                    <img src="/assets/images/25591682_ayn7_5130_220224.svg" alt="Email Generator" />
                </div>
                <div className="card-overlay">
                    <h2>Email Generator</h2>
                    <p>Create predefined email templates quickly and easily.</p>
                </div>
            </div>
        </div>
    </section>
);

export default AssistantSection;
