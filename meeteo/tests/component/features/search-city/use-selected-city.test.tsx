import { act, renderHook } from "@testing-library/react";

import { createCity } from "@/entities/city";
import { useSelectedCity } from "@/features/select-city";

describe("useSelectedCity", () => {
  it("persists and restores the selected city", () => {
    const madrid = createCity({
      id: "3117735",
      name: "Madrid",
      countryCode: "ES",
      region: "Comunidad de Madrid",
      coordinates: {
        latitude: 40.4165,
        longitude: -3.7026,
      },
    });

    const firstRender = renderHook(() => useSelectedCity());

    expect(firstRender.result.current.selectedCity).toBeNull();

    act(() => {
      firstRender.result.current.selectCity(madrid);
    });

    expect(
      firstRender.result.current.selectedCity,
    ).toEqual(madrid);

    firstRender.unmount();

    const secondRender = renderHook(() => useSelectedCity());

    expect(
      secondRender.result.current.selectedCity,
    ).toEqual(madrid);
  });
});