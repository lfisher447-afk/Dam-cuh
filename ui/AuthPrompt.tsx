import { ButtonProp } from "types";

function AuthPrompt({ children }: ButtonProp) {
  return (
    <p className="pb-6 text-center font-outfit text-[0.9375rem] font-normal text-white">
      {children}
    </p>
  );
}
export default AuthPrompt;
