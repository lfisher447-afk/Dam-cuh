import { motion } from "framer-motion";

function HeroSkeleton() {
  return (
    <motion.div
      className="h-[60vh] w-full bg-semiDarkBlue sm:h-[80vh] lg:h-[90vh]"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default HeroSkeleton;
