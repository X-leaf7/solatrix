import { ChatPage } from '@/features/chat/pages';
import { WebSocketProvider, ChatProvider } from '@/features/chat/providers';

const Page = async () => {

  // TODO: Room validation, authority validation

  return (
    <WebSocketProvider>
      <ChatProvider>
        <ChatPage />
      </ChatProvider>
    </WebSocketProvider>
  );
}

export default Page
