import type { CastWithPhoto } from "../../hooks/useCredits";

type CastRowProps = {
  cast: CastWithPhoto[];
};

function CastRow({ cast }: CastRowProps) {
  const topCast = cast.slice(0, 10);
  if (topCast.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-lg font-semibold">Top Cast</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {topCast.map((c) => (
          <div
            key={c.id}
            className="flex-shrink-0 text-center"
            style={{ width: "5rem" }}
          >
            <img
              src={c.photo}
              alt={c.name}
              className="mx-auto h-16 w-16 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%235A698F'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='white' font-size='14'%3E%3F%3C/text%3E%3C/svg%3E";
              }}
            />
            <p className="mt-1 truncate text-xs font-medium">{c.name}</p>
            <p className="truncate text-xs text-white/60">{c.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CastRow;
