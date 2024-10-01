import React from 'react';
import { FaDiscord, FaInstagram, FaWhatsapp, FaLinkedin,FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'; // Import social media icons

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column contact-info">
          <h2 className="Contact-details">Contact Info</h2>
          <span>
            &nbsp; <a href="https://www.google.com/maps?q=CBIT+Open+Source+Community" target="_blank" rel="noopener noreferrer" className="location-icon">
              <FaMapMarkerAlt />&nbsp;<b>CBIT Open Source Community</b>
            </a>
          </span> <br/>  
          <span>
            &nbsp; <FaPhone /><b>+91-020-25559200,020-25559201(President)</b>
          </span> <br/>
          <span>
          <a href="mailto:president@cosc.ac.in" className="email-link">
          &nbsp; <FaEnvelope /> <b>president@cosc.ac.in</b>
            </a>
          </span>
        </div>
        <div className="footer-column social-media">
          <h2 className="Contact-details">Follow Us</h2>
          <div className="social-icons">
            <a href="https://discord.gg/YFY9CD2DfZ" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div className="bottom-footer">
        <tt>
          <small>&copy; Copyright 2024. Designed and Developed by </small><a href="mailto:031mdsalman@gmail.com" className="email-link"><b>QuantumMinds Alliance</b></a>
        </tt>
      </div>
    </footer>
  );
}

export default Footer;
