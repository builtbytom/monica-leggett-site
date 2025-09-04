/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Monica's actual color scheme from her book/brand
        'monica-navy': '#1A3C5D',    // Deep navy/teal - main brand color
        'monica-teal': '#209697',    // Teal/turquoise accent
        'monica-sage': '#98B966',    // Sage green 
        'monica-blue': '#116DFF',    // Bright blue for CTAs
        'monica-dark': '#22495A',    // Dark text color
        'monica-light': '#414141',   // Light text color
        'monica-bg': '#F4EFEB',      // Warm background color
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}