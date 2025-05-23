import { FaFacebookF, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import dunpslogo from '../../assets/dumplogo.webp';
export default function Footer() {
  return (
    <footer className="bg-[#1E1E24] text-white text-sm px-6 py-10 md:px-20">
      <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-600 pb-8">
        {/* Left Column */}
        <div className="md:w-1/4">
          <p className="font-semibold">Disclaimer :</p>
          <p className="mt-2">
            We provide top-quality dumps, practice exams, and study materials for various certifications. Join us to ensure success in your IT career!
          </p>
          <img
            src={dunpslogo}
            alt="DumpsXpert Logo"
            className="mt-4 w-32"
          />
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">SAP Dumps</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Link Name</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2"><FaFacebookF /> Facebook</li>
            <li className="flex items-center gap-2"><FaLinkedinIn /> Linkedin</li>
            <li className="flex items-center gap-2"><FaYoutube /> Youtube-play</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-2">Subscribe to Our Newsletter</h3>
        <input
  type="email"
  placeholder="Enter your email"
  className="w-full px-3 py-2 rounded text-black placeholder-gray-500 bg-white"
/>

          <button className="bg-blue-600 text-white w-full mt-2 py-2 rounded hover:bg-blue-700">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-400 text-xs pt-4 flex flex-col md:flex-row justify-between mt-4 border-t border-gray-600 pt-4">
        <div className="mb-2 md:mb-0">
          © 2025 Exam Dump. All Rights Reserved. Designed By Dumpsxpert.Com
        </div>
        <div className="space-x-4">
          <a href="#" className="hover:underline">Guarantee</a>
          <a href="#" className="hover:underline">Terms & Condition</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Refund Policy</a>
        </div>
      </div>
    </footer>
  );
}
