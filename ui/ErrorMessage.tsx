function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-right text-xs font-normal tracking-wide text-red md:text-[0.8125rem]">
      {children}
    </p>
  );
}
export default ErrorMessage;
