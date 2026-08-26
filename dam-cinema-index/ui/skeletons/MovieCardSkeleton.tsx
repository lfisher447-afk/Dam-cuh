import { motion } from "framer-motion";

function MovieCardSkeleton() {
  return (
    <motion.div
      className="mb-4 flex flex-col"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="aspect-[16/9] w-full rounded-lg bg-semiDarkBlue" />
      <div className="mt-2 flex flex-col gap-2">
        <div className="h-3 w-2/3 rounded bg-semiDarkBlue" />
        <div className="h-4 w-3/4 rounded bg-semiDarkBlue" />
      </div>
    </motion.div>
  );
}

export default MovieCardSkeleton;
