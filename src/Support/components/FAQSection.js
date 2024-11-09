import React from 'react';
import { Accordion } from 'react-bootstrap';

const FAQSection = () => (
    <section className="faq container my-4">
        <h2 className="text-center">Frequently Asked Questions</h2>
        <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>University Life</Accordion.Header>
                <Accordion.Body>...</Accordion.Body>
            </Accordion.Item>
            {/* Repeat Accordion.Item for other questions */}
        </Accordion>
    </section>
);

export default FAQSection;
