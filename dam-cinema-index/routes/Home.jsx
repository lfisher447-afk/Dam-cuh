import Auth from "../pages/Auth";

const Home = () => {
  return (
    <div className=" ">
      <nav className="w-full absolute h-20 px-6 md:px-20 flex items-center justify-between from-black bg-linear-to-b ">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="text-(--primary)">Cine</span>
          <span className="text-white">AI</span>
        </h1>
      </nav>
      <Auth />
    </div>
  );
};

export default Home;
