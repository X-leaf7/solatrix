import { ChatCreate } from "@/features/chat/pages";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <ChatCreate />
    </Suspense>
  );
}
