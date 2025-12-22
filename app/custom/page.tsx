import {Suspense} from "react";

import CustomGame from "@/components/CustomGame";

export default function CustomMode() {
  return (
    <>
      <title>Blicblock - Custom Mode</title>
      <Suspense fallback={null}>
        <CustomGame/>
      </Suspense>
    </>
  );
}


