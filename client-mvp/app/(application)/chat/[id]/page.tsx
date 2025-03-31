import ChatPage from './ChatPage';
import { WebSocketProvider, ChatProvider } from '@/shared/providers';

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
