import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">About</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">LearnSphere Global</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Online courses</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">States</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* All Subjects Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">All Subjects</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Arts & Hobbies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Professional Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Computer Sciences</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Languages</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Music</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Health & Well-being</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">School Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sports</a></li>
            </ul>
          </div>

          {/* Join the adventure Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Join the adventure</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">LearnSphere</a></li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Help</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Centre</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Follow us Column */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Follow us</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <span className="text-sm">t</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <span className="text-sm">ig</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <p className="text-gray-400 text-sm cursor-pointer">
            © 2025 Apentai Nig Ltd
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;