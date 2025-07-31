"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatedSectionProps } from "@/types";

export const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
}: AnimatedSectionProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration,
        delay: inView ? delay : 0,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
