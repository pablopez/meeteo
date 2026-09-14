import { getSkyState } from "@/entities/weather";

describe("getSkyState", () => {
  const sunrise = "2026-09-04T06:00:00Z";
  const sunset = "2026-09-04T19:00:00Z";

  it.each([
    ["2026-09-04T04:29:59.999Z", "deep-night"],
    ["2026-09-04T04:30:00.000Z", "pre-dawn"],
    ["2026-09-04T05:29:59.999Z", "pre-dawn"],
    ["2026-09-04T05:30:00.000Z", "dawn"],
    ["2026-09-04T06:29:59.999Z", "dawn"],
    ["2026-09-04T06:30:00.000Z", "day"],
    ["2026-09-04T18:29:59.999Z", "day"],
    ["2026-09-04T18:30:00.000Z", "dusk"],
    ["2026-09-04T19:29:59.999Z", "dusk"],
    ["2026-09-04T19:30:00.000Z", "post-dusk"],
    ["2026-09-04T20:29:59.999Z", "post-dusk"],
    ["2026-09-04T20:30:00.000Z", "deep-night"],
  ] as const)(
    "maps %s to %s",
    (currentTime, expectedState) => {
      expect(
        getSkyState(new Date(currentTime), sunrise, sunset),
      ).toBe(expectedState);
    },
  );

  it("rejects invalid dates", () => {
    expect(() =>
      getSkyState(new Date("invalid"), sunrise, sunset),
    ).toThrow("Invalid sky state date");
  });
});
