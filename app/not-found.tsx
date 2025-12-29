"use client";
import styles from "./not-found.module.css";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const [seconds, setSeconds] = useState<number>(5);

  useEffect(() => {
    if (seconds === 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    }
  }, [seconds, router]);

  return (
    <>
      <title>Blicblock - Page Not Found</title>
      <div className={styles.content}>
        <h1>Page Not Found</h1>
        <p>
          Hmm... Looks like this page doesn't exist.
          <br/>
          Sending you back in {seconds} seconds...
        </p>
      </div>
    </>
  );
}
