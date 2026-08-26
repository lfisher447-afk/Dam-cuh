import { useTranslation } from "react-i18next";
import { PlayIconProps } from "types";

function Playicon({ className, onClick }: PlayIconProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={`absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[1.19rem] rounded-full bg-[#ffffff6e] px-4 py-2 opacity-0 transition duration-300 group-hover:opacity-100 ${className} `}
    >
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 15C0 6.7125 6.7125 0 15 0C23.2875 0 30 6.7125 30 15C30 23.2875 23.2875 30 15 30C6.7125 30 0 23.2875 0 15ZM21 14.5L12 8V21L21 14.5Z"
            fill="white"
          />
        </svg>
      </span>
      <span className="font-outfit text-[1.125rem] font-normal">{t("playIcon.play")}</span>
    </button>
  );
}

export default Playicon;
