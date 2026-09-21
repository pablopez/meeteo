"use client";

import { useEffect, useMemo, useState } from "react";

export type LiveTime = {
  day: string;
  time: string;
  currentTime: Date;
  separatorVisible: boolean;
};

export function useLiveTime(
  timezone: string,
  locale: string,
): LiveTime {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timezone]);

  return useMemo(
    () => ({
      day: new Intl.DateTimeFormat(locale, {
        weekday: "long",
        timeZone: timezone,
      }).format(now),
      time: new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now),
      currentTime: now,
      separatorVisible: now.getSeconds() % 2 === 0,
    }),
    [locale, now, timezone],
  );
}
