import ReactDOM from "react-dom";

import "./Footer.css";

const Footer = () => {
  const footer = (
    <footer className="footer">
      <h3 className="footer-title">
        &copy; Adi Leviim - All rights reserved 2020-2021
      </h3>
    </footer>
  );

  return ReactDOM.createPortal(footer, document.getElementById("footer"));
};

export default Footer;
