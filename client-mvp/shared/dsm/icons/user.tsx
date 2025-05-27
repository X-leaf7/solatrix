import React from 'react'

interface UserIconProps {
  width?: number
  height?: number
}

export const UserIcon: React.FC<UserIconProps> = ({
  width = 18,
  height = 18
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 7.50049C10.6569 7.50049 12 6.15734 12 4.50049C12 2.84363 10.6569 1.50049 9 1.50049C7.34315 1.50049 6 2.84363 6 4.50049C6 6.15734 7.34315 7.50049 9 7.50049Z" stroke="#1A1A1A" />
      <path d="M15 13.126C15 14.9897 15 16.501 9 16.501C3 16.501 3 14.9897 3 13.126C3 11.2622 5.6865 9.75098 9 9.75098C12.3135 9.75098 15 11.2622 15 13.126Z" stroke="#1A1A1A" />
    </svg>
  )
}
