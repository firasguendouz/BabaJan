import './Footer.css';

import PropTypes from 'prop-types';
import React from 'react';

const Footer = ({ text, links }) => {
  return (
    <footer className="app-footer">
      {/* Footer Text */}
      <div className="footer-text">
        <p>{text}</p>
      </div>

      {/* Footer Navigation */}
      {links.length > 0 && (
        <nav className="footer-nav" aria-label="Footer Navigation">
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </footer>
  );
};

Footer.propTypes = {
  text: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ),
};

Footer.defaultProps = {
  text: '© 2024 All rights reserved.',
  links: [],
};

export default Footer;
