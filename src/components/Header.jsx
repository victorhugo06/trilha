import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-[#79C7F7] p-4 shadow-md">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#264679]">Empresa</Link>
        <ul className="flex space-x-6">
          <li><Link to="/" className="text-[#264679] hover:text-[#F4AO79]">Home</Link></li>
          <li><Link to="/login" className="text-[#264679] hover:text-[#F4AO79]">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;