import { motion } from "framer-motion";

function DetailSkeleton() {
  return (
    <motion.div
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="h-screen w-full bg-semiDarkBlue" />
      <div className="space-y-4 p-12">
        <div className="h-8 w-1/3 rounded bg-semiDarkBlue" />
        <div className="h-4 w-1/2 rounded bg-semiDarkBlue" />
        <div className="h-4 w-full rounded bg-semiDarkBlue" />
        <div className="h-4 w-2/3 rounded bg-semiDarkBlue" />
      </div>
    </motion.div>
  );
}

export default DetailSkeleton;
