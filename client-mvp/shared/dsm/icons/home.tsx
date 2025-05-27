import React from 'react'

interface HomeProps {
  width?: number
  height?: number
}

export const Home: React.FC<HomeProps> = ({
  width = 13,
  height = 13,
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_40000284_7372)">
        <path d="M1.33301 6.602C1.33301 5.4575 1.33301 4.8855 1.59301 4.4115C1.85201 3.937 2.32651 3.643 3.27501 3.054L4.27501 2.4335C5.27751 1.811 5.77901 1.5 6.33301 1.5C6.88701 1.5 7.38801 1.811 8.39101 2.4335L9.39101 3.054C10.3395 3.643 10.814 3.937 11.0735 4.4115C11.333 4.8855 11.333 5.4575 11.333 6.6015V7.3625C11.333 9.3125 11.333 10.288 10.747 10.894C10.1615 11.5 9.21851 11.5 7.33301 11.5H5.33301C3.44751 11.5 2.50451 11.5 1.91901 10.894C1.33301 10.288 1.33301 9.313 1.33301 7.3625V6.602Z" stroke="black" />
        <path d="M6.33301 8V9.5" stroke="black" strokeLinecap="round" />
      </g>
      <defs>
        <clipPath id="clip0_40000284_7372">
          <rect width="12" height="12" fill="white" transform="translate(0.333008 0.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}
