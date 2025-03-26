'use client'

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ChatPage = dynamic(() => import ('./ChatPage'), {
  ssr: false
})

export default function Page() {

  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }
  
  return (
    <ChatPage />
  );
}
