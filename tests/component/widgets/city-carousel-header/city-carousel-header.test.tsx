import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createCity, type City } from "@/entities/city";
import { CityCarouselHeader } from "@/widgets/city-carousel-header";

jest.mock("@/shared/lib/time/use-live-time", () => ({
  useLiveTime: jest.fn(() => ({
    day: "Friday",
    time: "12:00:00",
    currentTime: new Date("2026-09-04T12:00:00Z"),
    separatorVisible: true,
  })),
}));

const madrid = createCity({
  id: "madrid",
  name: "Madrid",
  countryCode: "ES",
  region: "Comunidad de Madrid",
  coordinates: { latitude: 40.4165, longitude: -3.7026 },
});

const tokyo = createCity({
  id: "tokyo",
  name: "Tokyo",
  countryCode: "JP",
  region: "Tokyo",
  coordinates: { latitude: 35.6762, longitude: 139.6503 },
});

const berlin = createCity({
  id: "berlin",
  name: "Berlin",
  countryCode: "DE",
  coordinates: { latitude: 52.52, longitude: 13.405 },
});

type RenderHeaderOptions = {
  cities?: readonly City[];
  currentIndex?: number;
  timezones?: Record<string, string>;
  onPrevious?: () => void;
  onNext?: () => void;
};

function renderHeader({
  cities = [madrid],
  currentIndex = 0,
  timezones = {},
  onPrevious = jest.fn(),
  onNext = jest.fn(),
}: RenderHeaderOptions = {}) {
  return render(
    <CityCarouselHeader
      cities={cities}
      currentIndex={currentIndex}
      timezones={timezones}
      onPrevious={onPrevious}
      onNext={onNext}
    />,
  );
}

describe("CityCarouselHeader", () => {
  it("renders nothing when there are no cities", () => {
    const { container } = renderHeader({ cities: [] });

    expect(container.firstChild).toBeNull();
  });

  it("renders the current city name, region/country, time and favorite button", () => {
    renderHeader({
      cities: [madrid],
      timezones: { madrid: "UTC" },
    });

    expect(
      screen.getByRole("heading", { level: 2, name: "Madrid" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Comunidad de Madrid, ES"),
    ).toBeInTheDocument();

    expect(screen.getByText("12:00")).toBeInTheDocument();
    expect(screen.getByText("UTC")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add to favorites" }),
    ).toBeInTheDocument();
  });

  it("shows a placeholder time when the timezone is not available yet", () => {
    renderHeader({ cities: [madrid] });

    expect(screen.getByText("--:--")).toBeInTheDocument();
  });

  it("uses chevrons on mobile and city names on larger screens", () => {
    renderHeader({ cities: [madrid, tokyo, berlin] });

    const previousButton = screen.getByRole("button", {
      name: "Previous city: Berlin",
    });
    const nextButton = screen.getByRole("button", {
      name: "Next city: Tokyo",
    });

    expect(previousButton.querySelector("svg")).toHaveClass("sm:hidden");
    expect(nextButton.querySelector("svg")).toHaveClass("sm:hidden");
    expect(screen.getByText("Berlin")).toHaveClass("hidden", "sm:inline");
    expect(screen.getByText("Tokyo")).toHaveClass("hidden", "sm:inline");
    expect(screen.queryByText("Tokyo, JP")).not.toBeInTheDocument();
  });

  it("loops to the last city when navigating previous from the first city", async () => {
    const user = userEvent.setup();
    const onPrevious = jest.fn();

    renderHeader({
      cities: [madrid, tokyo, berlin],
      onPrevious,
    });

    await user.click(
      screen.getByRole("button", { name: "Previous city: Berlin" }),
    );

    expect(onPrevious).toHaveBeenCalled();
  });

  it("loops to the first city when navigating next from the last city", async () => {
    const user = userEvent.setup();
    const onNext = jest.fn();

    renderHeader({
      cities: [madrid, tokyo, berlin],
      currentIndex: 2,
      onNext,
    });

    await user.click(
      screen.getByRole("button", { name: "Next city: Madrid" }),
    );

    expect(onNext).toHaveBeenCalled();
  });

  it("shows the same adjacent city on both sides when there are only two cities", () => {
    renderHeader({ cities: [madrid, tokyo] });

    expect(
      screen.getByRole("button", { name: "Previous city: Tokyo" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Next city: Tokyo" }),
    ).toBeInTheDocument();
  });
});
