// Spinner.tsx
export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-darkBlue">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-semiDarkBlue sm:h-20 sm:w-20 md:h-24 md:w-24"></div>

        <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-red sm:h-20 sm:w-20 md:h-24 md:w-24"></div>
      </div>
    </div>
  );
}
