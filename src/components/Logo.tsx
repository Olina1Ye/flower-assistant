export default function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M14 3.2c-3.6 3-5.4 6.2-5.4 9.5 0 4 2.8 7.1 5.4 9.8 2.6-2.7 5.4-5.8 5.4-9.8 0-3.3-1.8-6.5-5.4-9.5Z"
        fill="url(#g1)"
      />
      <path
        d="M6.4 12.4c1.6 0 3.4.6 5.1 1.8-1.7 1.2-3.5 1.8-5.1 1.8-2 0-3.4-.9-4.4-3.6 1-2.7 2.4-3.6 4.4-3.6Z"
        fill="url(#g2)"
        opacity=".85"
      />
      <path
        d="M21.6 12.4c-1.6 0-3.4.6-5.1 1.8 1.7 1.2 3.5 1.8 5.1 1.8 2 0 3.4-.9 4.4-3.6-1-2.7-2.4-3.6-4.4-3.6Z"
        fill="url(#g2)"
        opacity=".85"
      />
      <defs>
        <linearGradient id="g1" x1="14" y1="3" x2="14" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="g2" x1="3" y1="14" x2="25" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#86EFAC" />
          <stop offset="1" stopColor="#FBCFE8" />
        </linearGradient>
      </defs>
    </svg>
  )
}
