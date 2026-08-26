import { motion } from "framer-motion";

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function StaggerContainer({
  children,
  staggerMs = 0.04,
  className,
}: {
  children: React.ReactNode;
  staggerMs?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: staggerMs } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
