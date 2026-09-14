import { act, renderHook } from "@testing-library/react";

import { useLiveTime } from "@/shared/lib/time/use-live-time";

describe("useLiveTime", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-09-04T12:00:00Z"));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("updates the time every second in the requested timezone", () => {
    const { result } = renderHook(() =>
      useLiveTime("Asia/Tokyo", "en-US"),
    );

    expect(result.current.day).toBe("Friday");
    expect(result.current.time).toBe("21:00:00");
    expect(result.current.currentTime.toISOString()).toBe(
      "2026-09-04T21:00:00.000Z",
    );
    expect(result.current.separatorVisible).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.time).toBe("21:00:01");
    expect(result.current.separatorVisible).toBe(false);

    act(() => {
      jest.advanceTimersByTime(59000);
    });

    expect(result.current.time).toBe("21:01:00");
  });

  it("cleans up its interval when unmounted", () => {
    const clearInterval = jest.spyOn(window, "clearInterval");
    const { unmount } = renderHook(() =>
      useLiveTime("UTC", "en-US"),
    );

    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });
});
