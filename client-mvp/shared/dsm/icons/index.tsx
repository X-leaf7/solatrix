import { ArrowBack } from './arrow-back';
import { ArrowTopRight } from './arrow-top-right';
import { Close } from './close';
import { Compass } from './compass';
import { Copy } from './copy';
import { Download } from './download';
import { Edit } from './edit';
import { Enter } from './enter';
import { Event } from './event';
import { Globe } from './globe';
import { Home } from './home';
import { Instagram } from './instagram';
import { Link } from './link';
import { Location } from './location';
import { LogoGoogle } from './logo-google';
import { PaperPlane } from './paper-plane';
import { Ranking } from './ranking';
import { Soccer } from './soccer';
import { TikTok } from './tiktok';
import { Trash } from './trash';
import { Twitter } from './twitter';
import { Wallet } from './wallet';
import { default as ChatButton } from './chat-button'
import { UserIcon } from './user';
import { AlertCircle } from './alert-circle';

export const Icons = {
  arrowBack: ArrowBack,
  compass: Compass,
  enter: Enter,
  instagram: Instagram,
  paperPlane: PaperPlane,
  ranking: Ranking,
  tiktok: TikTok,
  twitter: Twitter,
  wallet: Wallet,
  // logos
  logoGoogle: LogoGoogle,
  // old
  arrowTopRight: ArrowTopRight,
  close: Close,
  copy: Copy,
  download: Download,
  edit: Edit,
  event: Event,
  globe: Globe,
  home: Home,
  link: Link,
  location: Location,
  soccer: Soccer,
  trash: Trash,
  chatButton: ChatButton,
  user: UserIcon,
  alertCircle: AlertCircle
};

export type IconName = keyof typeof Icons;
