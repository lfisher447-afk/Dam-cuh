import { IoMdArrowDropdown } from "react-icons/io";
import { IoSparklesOutline } from "react-icons/io5";
// import { IoMdArrowDropup } from "react-icons/io";
import { useState } from "react";
import DropDown from "./DropDown";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleGptSearchView } from "../utils/gptSlice";
import LangDropDown from "./LangDropdown";

const Navbar = ({ email, username }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isLangDropDownOpen, setIsLangDropDownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const viewSearch = useSelector((store) => store.gpt.showGptSearch);
  const searchLang = useSelector((store) => store.gpt.title);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropDownOpen(false);
    navigate("/");
  };

  const handleSearchViewToggle = () => {
    dispatch(toggleGptSearchView());
  };

  return (
    <nav className="w-full z-999 top-0 left-0 absolute h-20 px-6 md:px-20 flex items-center justify-between from-black bg-linear-to-b ">
      <h1 className="text-4xl md:text-5xl font-bold">
        <span className="text-(--primary)">Cine</span>
        <span className="text-white">AI</span>
      </h1>

      <div className=" flex gap-4 justify-center items-center">
        {viewSearch && (
          <div className="relative ">
            <button
              onClick={() => setIsLangDropDownOpen((prev) => !prev)}
              className=" flex rounded bg-black/70 px-2 py-1  text-white"
            >
              <span className="hidden md:block text-white text-sm">
                {searchLang}
              </span>

              <div
                className={`text-white transition-transform duration-200 ${
                  isLangDropDownOpen ? "rotate-180" : ""
                }`}
              >
                <IoMdArrowDropdown size={20} />
              </div>
            </button>
            {isLangDropDownOpen && (
              <LangDropDown setIsLangDropDownOpen={setIsLangDropDownOpen} />
            )}
          </div>
        )}

        <button
          onClick={handleSearchViewToggle}
          className=" flex justify-center items-center gap-1 rounded-md bg-white px-4 py-1 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          {viewSearch ? (
            "Home"
          ) : (
            <>
              <IoSparklesOutline size={16} />
              <span>Ask CineAI</span>
            </>
          )}
        </button>
        <div className="relative ">
          <button
            onClick={() => setIsDropDownOpen((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-(--primary) flex items-center justify-center text-white font-semibold">
              {username?.[0]?.toUpperCase()}
            </div>

            <span className="hidden md:block text-white text-sm">
              {username}
            </span>

            <div
              className={`text-white transition-transform duration-200 ${
                isDropDownOpen ? "rotate-180" : ""
              }`}
            >
              <IoMdArrowDropdown size={20} />
            </div>
          </button>
          {isDropDownOpen && <DropDown onLogout={handleLogout} email={email} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
