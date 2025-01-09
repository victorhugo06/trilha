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
            <label className="text-2xl font-extrabold text-orange-400">Psicologia Comportamental</label>

          </h1>
          {/* Logo */}
          {/* Links */}
          <nav className="">
            <Link
              to="/"
              className="text-white font-medium px-4 py-2 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <label className="text-white font-medium">|</label>
            <Link
              to="/login"
              className="text-white font-medium px-4 py-2 hover:text-blue-600 transition"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo da Landing Page */}
      <div className="p-8">
        <section className="my-8">
          <h2 className="text-3xl font-bold text-center text-sky-400">Nossa História</h2>
          <p className="text-lg text-gray-700 mt-4 text-left">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          <br />
          <p className="text-lg text-gray-700 mt-4 text-left">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
          <br />
          <p className="text-lg text-gray-700 mt-4 text-left">
            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-3xl font-bold text-center text-orange-400">
            Atendimentos Oferecidos
          </h2>
          <ul className="text-lg text-gray-700 mt-4 space-y-2 text-center">
            <li>Avaliação e Intervenção em ABA</li>
            <li>Psicoterapia comportamental infantil</li>
            <li>Grupo de habilidades sociais</li>
            <li>Práticas de orientação parental</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 className="text-3xl font-bold text-center text-blue-900">Contato</h2>
          <p className="text-lg text-gray-700 mt-4 text-center">
            Email: contato@empresa.com
          </p>
          <p className="text-lg text-gray-700 mt-4 text-center">
            Telefone: 91 99999-9999
          </p>
          <p className="text-lg text-gray-700 mt-4 text-center">
            Instagram:
            <Link
              to="https://www.instagram.com/trilhapsicologia/"
              className="text-gray-700 font-normal hover:text-blue-600 transition"
            >
              @trilhapsicologia
            </Link>
          </p>
        </section>
      </div>
    </div >
  );
};

export default Home;
