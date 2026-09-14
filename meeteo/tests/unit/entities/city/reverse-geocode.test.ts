import { reverseGeocode } from "@/entities/city";

describe("reverseGeocode", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
  });

  it("maps a Nominatim city response to the domain", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        place_id: 123,
        address: {
          city: "Madrid",
          country_code: "es",
          state: "Comunidad de Madrid",
        },
      }),
    });

    await expect(
      reverseGeocode({
        latitude: 40.4168,
        longitude: -3.7038,
      }),
    ).resolves.toEqual({
      id: "nominatim-123",
      name: "Madrid",
      countryCode: "ES",
      region: "Comunidad de Madrid",
      coordinates: {
        latitude: 40.4168,
        longitude: -3.7038,
      },
      isFavorite: false,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        "lat=40.4168&lon=-3.7038",
      ),
      expect.objectContaining({
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("rejects a response without a city, town or village", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        place_id: 123,
        address: { country_code: "es" },
      }),
    });

    await expect(
      reverseGeocode({ latitude: 0, longitude: 0 }),
    ).rejects.toThrow("Invalid reverse geocoding response");
  });
});
