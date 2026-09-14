import { getCurrentLocation } from "@/entities/location";

const originalGeolocationDescriptor =
  Object.getOwnPropertyDescriptor(
    navigator,
    "geolocation",
  );

function mockGeolocation(
  getCurrentPosition: jest.Mock,
) {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: {
      getCurrentPosition,
    } as unknown as Geolocation,
  });
}

describe("getCurrentLocation", () => {
  afterEach(() => {
    if (originalGeolocationDescriptor) {
      Object.defineProperty(
        navigator,
        "geolocation",
        originalGeolocationDescriptor,
      );
    } else {
      Reflect.deleteProperty(
        navigator,
        "geolocation",
      );
    }

    jest.restoreAllMocks();
  });

  it("returns the current browser location", async () => {
    const position: GeolocationPosition = {
        coords: {
            latitude: 40.4168,
            longitude: -3.7038,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
            toJSON: function () {
                throw new Error("Function not implemented.");
            }
        },
        timestamp: Date.now(),
        toJSON: function () {
            throw new Error("Function not implemented.");
        }
    };

    const getCurrentPosition = jest.fn(
      (success: PositionCallback) => {
        success(position);
      },
    );

    mockGeolocation(getCurrentPosition);

    await expect(
      getCurrentLocation(),
    ).resolves.toEqual({
      id: "current-location",
      coordinates: {
        latitude: 40.4168,
        longitude: -3.7038,
      },
    });

    expect(getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 300_000,
      },
    );
  });

  it("rejects when geolocation is unavailable", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: undefined,
    });

    await expect(
      getCurrentLocation(),
    ).rejects.toThrow(
      "Geolocation is not supported",
    );
  });

  it("rejects when the browser cannot get the position", async () => {
    const getCurrentPosition = jest.fn(
      (
        _success: PositionCallback,
        error: PositionErrorCallback,
      ) => {
        error({} as GeolocationPositionError);
      },
    );

    mockGeolocation(getCurrentPosition);

    await expect(
      getCurrentLocation(),
    ).rejects.toThrow(
      "Unable to get current location",
    );
  });
});