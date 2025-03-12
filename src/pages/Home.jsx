import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen font-sans">
      {/* Navbar */}
      <header className="bg-orange-200 shadow-lg py-4 fixed w-full z-10">
        <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
          <div className="w-16 h-16 rounded-full border border-black">
            <img
              src="src/assets/images/logo.jpg"
              alt="Logo da Clínica"
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-orange-400 absolute top-4 left-24 py-3 text-center md:text-left">
            <span className="text-2xl font-extrabold text-sky-400">T</span>
            <span className="text-2xl font-extrabold text-pink-300">r</span>
            <span className="text-2xl font-extrabold text-pink-400">i</span>
            <span className="text-2xl font-extrabold text-orange-400">l</span>
            <span className="text-2xl font-extrabold text-green-300">h</span>
            <span className="text-2xl font-extrabold text-blue-900">a</span>
            <span className="text-2xl font-extrabold text-sky-400"> - </span>
            <span className="text-2xl font-extrabold text-orange-400">Psicologia Comportamental</span>
          </h1>
          <nav className="w-full flex justify-center mt-4 md:mt-0 md:w-auto">
            <Link
              to="/home"
              className="text-gray-700 font-medium px-4 hover:text-blue-600 transition duration-300"
            >
              Home
            </Link>
            <span className="text-gray-700 font-medium">|</span>
            <Link
              to="/login"
              className="text-gray-700 font-medium px-4 hover:text-blue-600 transition duration-300"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo da Landing Page */}
      <main className="p-4 sm:p-8 pt-32">
        <section className="my-12 text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-sky-400">Nossa História</h2>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed max-w-2xl mx-auto">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry...
          </p>
        </section>

        <section className="my-12 text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-orange-400">
            Atendimentos Oferecidos
          </h2>
          <ul className="text-lg text-gray-700 mt-4 space-y-2">
            <li>Avaliação e Intervenção em ABA</li>
            <li>Psicoterapia comportamental infantil</li>
            <li>Grupo de habilidades sociais</li>
            <li>Práticas de orientação parental</li>
          </ul>
        </section>

        <section className="my-12 text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-pink-400">
            Nossa equipe
          </h2>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true, el: '.hidden-pagination' }}
            spaceBetween={15}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="mt-6"
          >
            <SwiperSlide>
              <div className="w-32 h-32 mx-auto rounded-full border-2 border-orange-400 shadow-md">
                <img
                  src="https://png.pngtree.com/png-clipart/20190705/original/pngtree-vector-business-men-icon-png-image_4186858.jpg"
                  alt="Usuário 1"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <p className="text-center mt-2 text-gray-700">Usuário 1</p>
            </SwiperSlide>
            {/* Outros slides */}
          </Swiper>
        </section>

        <section className="my-12 text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-blue-900">
            Contato
          </h2>
          <p className="text-lg text-gray-700 mt-4">
            Email: contato@empresa.com
          </p>
          <p className="text-lg text-gray-700 mt-4">
            Telefone: 91 99999-9999
          </p>
          <p className="text-lg text-gray-700 mt-4">
            Instagram:
            <Link
              to="https://www.instagram.com/trilhapsicologia/"
              className="text-gray-700 font-normal hover:text-blue-600 transition duration-300"
            >
              @trilhapsicologia
            </Link>
          </p>
        </section>
      </main>

      <footer className="text-center text-lg text-gray-700 bg-orange-200 py-6">
        <p>&copy; 2025 - Trilha. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
