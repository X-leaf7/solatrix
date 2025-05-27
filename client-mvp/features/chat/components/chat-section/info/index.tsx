import { Avatar, Button } from '@/shared/dsm';
import { Icons } from '@/shared/dsm';
import { useChatContext } from '@/features/chat/providers';

import styles from './styles.module.sass';

export function ChatEventInfo() {
  const { chatRoomInfo } = useChatContext();

  const UserIcon = Icons['user'];

  return (
    <div className={styles.base}>
      <div className={styles.link}>
        Chat <Button icon="chatButton" size="large" intent="tertiary" />
      </div>

      <div className={styles.box}>
        {chatRoomInfo?.hostName.trim() && (
          <>
            <Avatar size="small" />
            <p>
              Host: {chatRoomInfo?.hostName}
            </p>
            <div className={styles.divider} />
          </>
        )}
        <UserIcon />
        <p>{chatRoomInfo?.roomMemberCount} Users</p>
      </div>
    </div>
  );
}
