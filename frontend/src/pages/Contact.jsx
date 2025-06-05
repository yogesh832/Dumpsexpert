import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Link } from "react-router";

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-10">
        <div className="flex flex-col flex-1 justify-center ">
<h2 className="text-4xl font-bold mb-2">Contact Us</h2>
        <h2 className="text-4xl font-bold mb-2">24X7 support Available</h2>
        <p className="text-[#555] text-base leading-relaxed mb-4">
          We'd love to hear from you! Whether you have a question about our
          services, need assistance, or just want to give feedback, feel free to
          reach out to us.
        </p>
         <p className="mb-1"><strong>Email:</strong> info@dumsxpert.com</p>
          <p className="mb-1"><strong>Phone:</strong> +91-9871952577</p>
          <p className="mb-4"><strong>Address:</strong> Whitefield, Bengaluru, Karnataka 560066</p>
        <div className="flex gap-5 text-3xl text-[#555]">
          <Link to="https://dumpsxpert.com/contact" target="_blank">
          <FaFacebook />
          </Link>
          <Link to="https://x.com/DumpsXpert" target="_blank">
          <FaXTwitter />
          </Link>
          <Link to="https://www.linkedin.com/company/dumpsxpert/" target="_blank">
          <FaLinkedinIn />
          </Link>
          <Link to="https://dumpsxpert.com/contact" target="_blank">
          <FaInstagram />
          </Link>
          <Link to="https://www.youtube.com/@DumpsXpert" target="_blank">
          <FaYoutube />
          </Link>
        </div>
        </div>
        
     <div className="flex-1 bg-white p-6 mt-20 shadow-lg rounded-lg ">
          <form className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <Input placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <Input placeholder="Enter your email" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Subject</label>
              <Input placeholder="Enter subject" />
            </div>
            <div>
               <label className="block mb-1 font-medium">Message</label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Write your message here"
              />
            </div>
            <Button className="mt-2">Submit</Button> 
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
