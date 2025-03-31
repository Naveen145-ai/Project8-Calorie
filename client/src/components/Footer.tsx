import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="font-bold text-xl text-white">NutriScan<span className="text-primary">AI</span></span>
            </div>
            <p className="text-neutral-400 max-w-xs">
              Revolutionizing nutrition tracking with AI technology to help you achieve your health goals.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Press</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Nutrition Guide</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Workout Tips</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} NutriScan AI. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
