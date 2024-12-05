import React from 'react';
import logo from "/logo.png";

const Header = () => {
    return (

        <header className="bg-gray-200 text-white" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems:"center"}}>
        <div style={{ width: '100px', height: '50px', }}>
            <img src={logo} alt="Trello_logo" style={{width: "100%", height: "100%", objectFit: "contain"}} />
       </div>
      </header>

    );
};
export default Header;
 