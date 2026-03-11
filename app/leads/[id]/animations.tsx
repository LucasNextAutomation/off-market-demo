"use client"

import { motion, type Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
}

export function LeadDetailAnimations({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={cardVariants} className={className}>
      {children}
    </motion.div>
  )
}
