import React from 'react';
import logo from "/logo.png";

const Header = () => {
    return (
        <header className="bg-gray-100 text-white p-5 flex justify-center items-center">
            <img src={logo} alt="Trello logo" className="w-40" />
        </header>
    );
};

export default Header;
