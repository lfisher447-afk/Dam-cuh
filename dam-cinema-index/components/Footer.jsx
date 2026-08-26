import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-black/80 backdrop-blur-sm border-t border-(--border)">
      <div className="w-[90%] max-w-7xl mx-auto py-10">
        <h2 className="text-2xl font-bold">
          <span className="text-(--primary)">Cine</span>
          <span className="text-white">AI</span>
        </h2>

        <p className="mt-3 text-(--text-muted) max-w-md">
          Browse movies, watch trailers, and get suggestions from a simple
          prompt.
        </p>

        <div className="mt-8 flex flex-wrap gap-6 text-(--text-muted)">
          <a
            href="https://github.com/yuvrajk-dev/CineAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-(--primary) transition"
          >
            <FaGithub />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/yuvrajkumar01/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-(--primary) transition"
          >
            <FaLinkedin />
            LinkedIn
          </a>

          <a
            href="mailto:yuvrajk.dev@gmail.com"
            className="flex items-center gap-2 hover:text-(--primary) transition"
          >
            <FaEnvelope />
            Contact
          </a>
        </div>

        <div className="mt-8 border-t border-(--border) pt-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-(--text-muted)">
          <p>© {new Date().getFullYear()} Yuvraj Kumar. All rights reserved.</p>

          <p>
            Built with React • Vite • Tailwind CSS • Redux Toolkit • TMDB API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
