import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Navbar */}
      <header className="bg-orange-200 shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
        <div className="w-16 h-16 rounded-full border-1 border-black ">
          {/* Ícone de usuário ou foto */}
          <img
            src="src/assets/images/logo.jpg"
            alt="Usuário"
            className="rounded-full"
          />
        </div>
          <h1 className="text-2xl font-bold text-orange-400 absolute top-4 px-20 py-3">
            <label className="text-2xl font-extrabold text-sky-400">T</label>
            <label className="text-2xl font-extrabold text-pink-300">r</label>
            <label className="text-2xl font-extrabold text-pink-400">i</label>
            <label className="text-2xl font-extrabold text-orange-400">l</label>
            <label className="text-2xl font-extrabold text-green-300">h</label>
            <label className="text-2xl font-extrabold text-blue-900">a</label>
            <label className="text-2xl font-extrabold text-sky-400"> - </label>
            <label className="text-2xl font-extrabold text-pink-300">P</label>
            <label className="text-2xl font-extrabold text-pink-400">s</label>
            <label className="text-2xl font-extrabold text-orange-400">i</label>
            <label className="text-2xl font-extrabold text-green-300">c</label>
            <label className="text-2xl font-extrabold text-blue-900">o</label>
            <label className="text-2xl font-extrabold text-sky-400">l</label>
            <label className="text-2xl font-extrabold text-pink-300">o</label>
            <label className="text-2xl font-extrabold text-pink-400">g</label>
            <label className="text-2xl font-extrabold text-orange-400">i</label>
            <label className="text-2xl font-extrabold text-green-300">a</label>
            <label className="text-2xl font-extrabold text-green-300"> </label>
            <label className="text-2xl font-extrabold text-blue-900">C</label>
            <label className="text-2xl font-extrabold text-sky-400">o</label>
            <label className="text-2xl font-extrabold text-pink-300">m</label>
            <label className="text-2xl font-extrabold text-pink-400">p</label>
            <label className="text-2xl font-extrabold text-orange-400">o</label>
            <label className="text-2xl font-extrabold text-green-300">r</label>
            <label className="text-2xl font-extrabold text-blue-900">t</label>
            <label className="text-2xl font-extrabold text-sky-400">a</label>
            <label className="text-2xl font-extrabold text-pink-300">m</label>
            <label className="text-2xl font-extrabold text-pink-400">e</label>
            <label className="text-2xl font-extrabold text-orange-400">n</label>
            <label className="text-2xl font-extrabold text-green-300">t</label>
            <label className="text-2xl font-extrabold text-blue-900">a</label>
            <label className="text-2xl font-extrabold text-sky-400">l</label>
          </h1>
          {/* Logo */}
          {/* Links */}
          <nav className="">
            <Link
              to="/login"
              className="text-white font-medium bg-orange-400 px-4 py-2 hover:text-blue-600 transition"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo da Landing Page */}
      <div className="p-8">
        <section className="my-8">
          <h2 className="text-3xl font-bold text-center text-blue-900">História</h2>
          <p className="text-lg text-gray-700 mt-4 text-center">
            Conteúdo da história da empresa...
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-3xl font-bold text-center text-blue-900">
            Atendimentos Oferecidos
          </h2>
          <ul className="text-lg text-gray-700 mt-4 space-y-2">
            <li>Serviço 1</li>
            <li>Serviço 2</li>
            <li>Serviço 3</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 className="text-3xl font-bold text-center text-blue-900">Contato</h2>
          <p className="text-lg text-gray-700 mt-4 text-center">
            Email: contato@empresa.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default Home;
