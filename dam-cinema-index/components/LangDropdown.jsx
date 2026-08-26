import lang from "../utils/languageConstants";
import { changeTitle, changeLang } from "../utils/gptSlice";
import { useDispatch } from "react-redux";

const LangDropDown = ({ setIsLangDropDownOpen }) => {
  const dispatch = useDispatch();
  return (
    <div className="absolute flex flex-col   top-14  bg-black/95 border  border-zinc-700 shadow-2xl">
      {Object.entries(lang).map(([key, value]) => (
        <button
          onClick={() => {
            dispatch(changeTitle(value.title));
            dispatch(changeLang(value.language));

            setIsLangDropDownOpen(false);
          }}
          key={key}
          className="w-full  px-4 py-3 text-center  text-white transition-colors hover:bg-zinc-800"
        >
          {value.title}
        </button>
      ))}
    </div>
  );
};

export default LangDropDown;
