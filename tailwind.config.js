export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: 'var(--sand)',
        seafoam: 'var(--seafoam)',
        orange: 'var(--orange)',
        lavender: 'var(--lavender)',
        cocoa: 'var(--cocoa)',
        horizon: 'var(--horizon)',
        mist: 'var(--mist)',
        coral: 'var(--coral)',
      },
      fontFamily: {
        serif: ['var(--serif-display)'],
        mono: ['var(--mono-body)'],
      },
      boxShadow: {
        paper: 'var(--shadow-card)',
        soft: 'var(--shadow-soft)',
      },
    },
  },
}