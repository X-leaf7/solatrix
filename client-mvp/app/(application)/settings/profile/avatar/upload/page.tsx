import { Suspense } from "react";
import { AvatarUploader } from "@/features/settings/components";

export default function Page() {
  return (
    <Suspense>
      <AvatarUploader />
    </Suspense>
  )
}
