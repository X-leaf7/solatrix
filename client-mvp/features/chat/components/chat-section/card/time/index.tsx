import { useChatContext } from '@/features/chat/providers';
import { formatEventStartTimeDisplay } from '@/shared/utils';

import styles from './styles.module.sass';

export function Time() {
  const { chatRoomInfo } = useChatContext();
  return (
    <div className={styles.base}>
      <h4 className={styles.heading}>
        {chatRoomInfo?.eventStartTime && formatEventStartTimeDisplay('upcoming', chatRoomInfo.eventStartTime)}
      </h4>
    </div>
  );
}
