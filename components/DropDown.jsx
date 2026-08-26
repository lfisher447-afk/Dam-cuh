const DropDown = ({ onLogout, email }) => {
  return (
    <div className="absolute right-0 top-14 w-56 bg-black/95 border border-zinc-700 shadow-2xl">
      <div className="  absolute right-5 -top-2 h-4 w-4 rotate-45 border-l border-t border-zinc-700 bg-black/95" />

      <div className="border-b border-zinc-700 px-4 py-3 text-sm text-zinc-300 truncate">
        {email}
      </div>

      <button
        onClick={onLogout}
        className="w-full px-4 py-3 text-left text-white transition-colors hover:bg-zinc-800"
      >
        Sign out of CineAI
      </button>
    </div>
  );
};

export default DropDown;
