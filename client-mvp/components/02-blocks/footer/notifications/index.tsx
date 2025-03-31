import { Button } from '@/shared/dsm';

export function Notifications() {
  return (
    <div>
      <h2>We would like to send you notifications</h2>
      <p>
        Notifications may include alerts, sounds and icon badges. These can be
        configured in Settings.
      </p>
      <div>
        <Button intent="tertiary">Don’t Allow</Button>
        <Button>Allow</Button>
      </div>
    </div>
  );
}
