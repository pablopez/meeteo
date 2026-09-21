import { expect, test } from "@playwright/test";

test.describe("language preference", () => {
  test("changes and persists the selected language", async ({
    page,
  }) => {
    await page.goto("/");

    // Establecemos un estado inicial conocido.
    await page.evaluate(() => {
      window.localStorage.setItem(
        "meeteo:language",
        "en",
      );
    });

    await page.reload();

    // Usamos aria-controls porque el texto del botón
    // cambia cuando cambia el idioma.
    const menuButton = page.locator(
      '[aria-controls="app-menu-panel"]',
    );

    await expect(menuButton).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    await menuButton.click();

    await expect(menuButton).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await page
      .getByRole("button", { name: "Language" })
      .click();

    await page
      .getByRole("button", { name: "Español" })
      .click();

    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      "es",
    );

    await expect(menuButton).toHaveAttribute(
      "aria-label",
      "Cerrar menú",
    );

    // Cerramos el menú para comprobar el contenido
    // principal traducido.
    await menuButton.click();

    await expect(
      page.getByText(
        "Información meteorológica de localidades de todo el mundo.",
      ),
    ).toBeVisible();

    // Comprobamos que el idioma persiste tras recargar.
    await page.reload();

    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      "es",
    );

    await expect(menuButton).toHaveAttribute(
      "aria-label",
      "Abrir menú",
    );

    await menuButton.click();

    await page
      .getByRole("button", { name: "Idioma" })
      .click();

    await expect(
      page.getByRole("button", { name: "Español" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
