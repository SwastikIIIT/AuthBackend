import React from "react";
import { Mail, MessageSquare, Github, Twitter, Linkedin } from "lucide-react";
// Conditionally import framer-motion
import dynamic from "next/dynamic";

// Create regular non-motion versions first
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-black border-t border-purple-900/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Auth Backend</h3>
            <p className="text-gray-400 max-w-md mb-6">
              Secure, scalable, and simple authentication for modern applications. 
              Built with developers in mind.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">API Reference</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Guides</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Examples</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-purple-500 mr-2" />
                <a href="mailto:support@authbackend.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                  support@authbackend.com
                </a>
              </li>
              <li className="flex items-center">
                <MessageSquare className="w-4 h-4 text-purple-500 mr-2" />
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Live Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-900/20">
          <p className="text-center text-gray-500 text-sm">
            © {currentYear} Auth Backend. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;