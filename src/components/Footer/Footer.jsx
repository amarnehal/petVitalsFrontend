const Footer = () => {
  return (
    <footer className="bg-[#5063A9] shadow-lg py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-md text-white">
        <p className="mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} VetCare. All rights reserved.
        </p>

        <div className="flex space-x-4">
          <h3  className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </h3>
          <h3  className="hover:text-blue-600 transition-colors">
            Terms of Service
          </h3>
          <h3 className="hover:text-blue-600 transition-colors">
            Contact
          </h3>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
