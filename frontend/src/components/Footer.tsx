import { Link } from 'react-router-dom';
import { Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container-custom py-12">
        <nav className="flex justify-center space-x-8 mb-6">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Social Media */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <p className="text-gray-600 text-sm font-medium">Follow Us</p>
          <a
            href="https://www.facebook.com/jill.payton.2025"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Visit our Facebook page"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>

        <p className="text-center text-gray-600 text-sm">
          &copy;{currentYear} Payton Place Development. All rights reserved.
        </p>

        {/* Admin Login Link - Small and discreet */}
        <div className="text-center mt-4">
          <Link
            to="/admin/login"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
