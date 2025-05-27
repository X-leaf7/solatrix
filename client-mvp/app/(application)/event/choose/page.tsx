import { EventChoose } from "@/features/event/pages";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <EventChoose />
    </Suspense>
  );
}
