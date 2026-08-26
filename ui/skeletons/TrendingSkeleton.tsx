import { motion } from "framer-motion";

const items = [1, 2, 3, 4];

function TrendingSkeleton() {
  return (
    <div className="flex gap-4">
      {items.map((i) => (
        <motion.div
          key={i}
          className="aspect-[16/9] w-[300px] flex-shrink-0 rounded-lg bg-semiDarkBlue"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

export default TrendingSkeleton;
