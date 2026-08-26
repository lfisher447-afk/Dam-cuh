import { ButtonProp } from "types";

function Button({ children }: ButtonProp) {
  return (
    <button
      type="submit"
      className="mb-6 rounded-[0.375rem] bg-red p-4 font-outfit text-[0.9375rem] font-normal text-white transition-all delay-75 hover:bg-white hover:text-semiDarkBlue"
    >
      {children}
    </button>
  );
}

export default Button;
