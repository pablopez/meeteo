type LiveClockProps = {
  time: string;
  timezone: string;
  separatorVisible: boolean;
  className?: string;
};

export function LiveClock({
  time,
  timezone,
  separatorVisible,
  className = "",
}: LiveClockProps) {
  const separatorIndex = time.indexOf(":");
  const hours =
    separatorIndex === -1 ? time : time.slice(0, separatorIndex);
  const minutes =
    separatorIndex === -1 ? "" : time.slice(separatorIndex + 1);

  return (
    <time
      className={`text-center text-solar-text ${className}`}
      aria-label={`${time}, ${timezone}`}
    >
      <strong className="block font-mono text-xl tabular-nums">
        {hours}
        {separatorIndex !== -1 && (
          <span
            aria-hidden="true"
            className={separatorVisible ? "opacity-100" : "opacity-0"}
          >
            :
          </span>
        )}
        {minutes}
      </strong>
      <span className="block text-xs opacity-75">
        {timezone}
      </span>
    </time>
  );
}
