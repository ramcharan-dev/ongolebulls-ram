import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ─── Spring configs ──────────────────────────────────────────────────── */
const snappy  = { type: "spring", stiffness: 120, damping: 18 };
const gentle  = { type: "spring", stiffness: 80,  damping: 22 };
const bouncy  = { type: "spring", stiffness: 150, damping: 15, mass: 0.8 };

/* ─── Reveal Variants ─────────────────────────────────────────────────── */
export const revealVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: snappy },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: snappy },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: snappy },
  },
  slideRight: {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0, transition: snappy },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: bouncy },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 30 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: gentle },
  },
};

/* ─── Stagger wrapper ─────────────────────────────────────────────────── */
const staggerParent = (staggerDelay = 0.08) => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0.05 } },
});

/**
 * ScrollReveal — triggers children animation when section enters viewport.
 * @param {string} variant - one of: fadeUp, fadeDown, slideLeft, slideRight, scaleUp, blur
 * @param {number} stagger - stagger delay between children
 */
export function ScrollReveal({
  children,
  variant = "fadeUp",
  stagger = 0.08,
  className,
  style,
  amount = 0.15,
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerParent(stagger)}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealItem — child element that animates with a chosen variant.
 */
export function RevealItem({ children, variant = "fadeUp", className, style, custom }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={revealVariants[variant] || revealVariants.fadeUp}
      custom={custom}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollScale — element scales based on scroll progress (parallax-like).
 * Great for hero images or background elements.
 */
export function ScrollScale({ children, className, style, scaleRange = [1, 0.92], opacityRange = [1, 0] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const opacity = useTransform(scrollYProgress, [0, 0.8], opacityRange);

  return (
    <motion.div ref={ref} className={className} style={{ ...style, scale, opacity }}>
      {children}
    </motion.div>
  );
}

/**
 * FloatingOrb — animated gradient blob for premium depth backgrounds.
 */
export function FloatingOrb({ color, size, top, left, delay = 0, duration = 20 }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        top,
        left,
        borderRadius: "50%",
        background: color,
        filter: "blur(80px)",
        opacity: 0.5,
        pointerEvents: "none",
        willChange: "transform",
      }}
      animate={{
        y: [0, -30, 15, -20, 0],
        x: [0, 20, -15, 10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/**
 * TextReveal — word-by-word spring animation for headlines.
 */
export function TextReveal({ text, className, as = "h1", delay = 0 }) {
  const words = text.split(" ");
  const Tag = motion[as] || motion.h1;

  return (
    <Tag className={className} style={{ overflow: "hidden" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.3em" }}
          initial={{ opacity: 0, y: 40, rotateX: 40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            ...bouncy,
            delay: delay + i * 0.06,
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

/**
 * useParallax — parallax offset based on element scroll progress.
 */
export function useParallax(ref, range = [-50, 50]) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], range);
}

/**
 * ParallaxLayer — div that moves at a different scroll speed.
 */
export function ParallaxLayer({ children, speed = 0.2, className, style }) {
  const ref = useRef(null);
  const y = useParallax(ref, [speed * -120, speed * 120]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, y, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
