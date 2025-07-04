import React from "react";

const NoteBanner = ({ children }) => (
    <div style={{ maxWidth: 700, margin: '0 auto 1.5rem', background: '#f1f5fa', color: '#205295', borderRadius: 10, padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 500, boxShadow: '0 2px 8px rgba(20,66,114,0.07)' }}>
        {children}
    </div>
);

export default NoteBanner; 