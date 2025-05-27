import { DividerGradient } from '@/shared/dsm';
import { Score } from './score';
import { Team } from './team';
import { Time } from './time';
import { useChatContext } from '@/features/chat/providers';

import styles from './styles.module.sass';

export function ChatEventCard() {
  const { chatRoomInfo } = useChatContext();

  return (
    <div className={styles.base}>
      <div className={styles.grid}>
        <Team
          isHome={true}
          teamName={chatRoomInfo?.homeTeam}
        />
        <div className={styles.main}>
          <Score
            home={chatRoomInfo?.score.homeTeamScore}
            away={chatRoomInfo?.score.awayTeamScore}
          />
        </div>
        <Team
          isHome={false}
          teamName={chatRoomInfo?.awayTeam}
        />
      </div>

      <div className={styles.time}>
        <DividerGradient color="#888" />
        <Time />
      </div>
    </div>
  );
}
