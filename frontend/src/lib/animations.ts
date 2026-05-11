export const fadeUp = {
  hidden:  { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  })
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1,
    transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }  /* spring-like */
  }
};

export const slideFromRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
};

export const cardHover = {
  rest:  { scale: 1,    transition: { duration: 0.3, ease: 'easeOut' } },
  hover: { scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } }
};

export const shakeX = {
  animate: { x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.55, ease: 'easeInOut' } }
};

export const bounceIn = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 500, damping: 22 }
  }
};

export const successPop = {
  hidden:  { scale: 0.6, opacity: 0 },
  visible: { scale: [0.6, 1.15, 1], opacity: 1,
    transition: { duration: 0.5, ease: [0.34,1.56,0.64,1] }
  }
};
