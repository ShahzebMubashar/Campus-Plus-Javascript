import React, { useState } from 'react';

const Navbar = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const services = {
        'Most Viewed Past Papers': {
            icon: 'ri-heart-line',
            items: [
                'Data Structures (DS)',
                'Calculus (Cal)',
                'Theory of Automata (TOA)',
                'Assembly Language (COAL)'
            ]
        },
        'News & Events': {
            icon: 'ri-newspaper-line',
            items: [
                'FDC X',
                'SOFTEC \'24',
                'GDSC Hiring Candidates?',
                'Change in HoD'
            ]
        },
        'Accessibility': {
            icon: 'ri-home-line',
            items: [
                'Faculty Info',
                'Time Table Generator',
                'Faculty Information',
                'To Do List'
            ]
        },
        'Youtube Playlists': {
            icon: 'ri-youtube-line',
            items: [
                'Abdul Bari (Algorithms)',
                'Neso Academy (DLD)',
                'Code with Harry (PF)',
                'Brain Molder (Database)'
            ]
        }
    };

    return (
        <div className="w-full">
            <nav className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/" className="flex items-center text-[#003479] font-semibold">
                            <img src="/api/placeholder/40/40" alt="Campus+ Logo" className="h-10" />
                            <span className="ml-2 text-xl">ampus+</span>
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <a href="/past-papers" className="text-gray-700 hover:text-[#003479]">Past Papers</a>

                        {/* Services Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('services')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="text-gray-700 hover:text-[#003479] flex items-center">
                                Services
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {activeDropdown === 'services' && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[800px] bg-white rounded-lg shadow-lg p-6">
                                    <div className="grid grid-cols-4 gap-8">
                                        {Object.entries(services).map(([title, { icon, items }]) => (
                                            <div key={title} className="space-y-4">
                                                <div className="flex items-center space-x-2 text-[#003479]">
                                                    <i className={`${icon} text-xl`}></i>
                                                    <h3 className="font-semibold">{title}</h3>
                                                </div>
                                                <ul className="space-y-2">
                                                    {items.map((item) => (
                                                        <li key={item}>
                                                            <a href="#" className="text-gray-600 hover:text-[#003479] text-sm">
                                                                {item}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Generators Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('generators')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="text-gray-700 hover:text-[#003479] flex items-center">
                                Generators
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        <a href="/chatgpt" className="text-gray-700 hover:text-[#003479]">ChatGPT</a>

                        {/* Student Support Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('support')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="text-gray-700 hover:text-[#003479] flex items-center">
                                Student Support
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button className="text-gray-700 hover:text-[#003479]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;