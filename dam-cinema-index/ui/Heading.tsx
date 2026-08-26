import { HeadingProp } from "types";

function Heading({ children }: HeadingProp) {
  return (
    <h1 className="pb-4 font-outfit text-xl font-normal leading-normal tracking-wide md:text-[2rem]">
      {children}
    </h1>
  );
}
export default Heading;
