import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppMenu, type PanelKey } from "@/widgets/app-menu";

type RenderAppMenuOptions = {
  isOpen?: boolean;
  activePanel?: PanelKey | null;
  onOpenChange?: (isOpen: boolean) => void;
  onActivePanelChange?: (panel: PanelKey | null) => void;
  onCitySelect?: (city: unknown) => void;
  onCityLocated?: (city: unknown) => void;
};

function renderAppMenu({
  isOpen = false,
  activePanel = null,
  onOpenChange = jest.fn(),
  onActivePanelChange = jest.fn(),
  onCitySelect = jest.fn(),
  onCityLocated = jest.fn(),
}: RenderAppMenuOptions = {}) {
  return render(
    <AppMenu
      isOpen={isOpen}
      activePanel={activePanel}
      onOpenChange={onOpenChange}
      onActivePanelChange={onActivePanelChange}
      onCitySelect={onCitySelect}
      onCityLocated={onCityLocated}
    />,
  );
}

describe("AppMenu", () => {
  it("renders a fixed header with the application title and menu toggle", () => {
    renderAppMenu({ isOpen: false });

    expect(
      screen.getByRole("heading", { level: 1, name: "Meeteo" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });

  it("shows the full-screen overlay when open", () => {
    renderAppMenu({ isOpen: true });

    const overlay = screen.getByRole("dialog");

    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute("aria-modal", "true");
    expect(overlay).toHaveAttribute("aria-labelledby", "app-menu-title");
  });

  it("hides the overlay and keeps it out of the accessibility tree when closed", async () => {
    const { rerender } = renderAppMenu({ isOpen: true });

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(
      <AppMenu
        isOpen={false}
        activePanel={null}
        onOpenChange={jest.fn()}
        onActivePanelChange={jest.fn()}
        onCitySelect={jest.fn()}
        onCityLocated={jest.fn()}
      />,
    );

    await waitFor(
      () => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it("toggles the menu when the toggle button is pressed and defaults to the search panel", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const onActivePanelChange = jest.fn();

    renderAppMenu({
      isOpen: false,
      onOpenChange,
      onActivePanelChange,
    });

    await user.click(
      screen.getByRole("button", { name: "Open menu" }),
    );

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(onActivePanelChange).toHaveBeenCalledWith("search");
  });

  it("closes the menu with the Escape key and resets the active panel", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const onActivePanelChange = jest.fn();

    renderAppMenu({
      isOpen: true,
      activePanel: "search",
      onOpenChange,
      onActivePanelChange,
    });

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onActivePanelChange).toHaveBeenCalledWith(null);
  });

  it("locks the body scroll while the overlay is open and restores it on unmount", () => {
    const previousOverflow = document.body.style.overflow;

    const { unmount } = renderAppMenu({ isOpen: true });

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe(previousOverflow);
  });

  it("defaults to the search panel when opened programmatically", () => {
    const onActivePanelChange = jest.fn();

    renderAppMenu({
      isOpen: true,
      activePanel: null,
      onActivePanelChange,
    });

    expect(onActivePanelChange).toHaveBeenCalledWith("search");
  });

  it("renders the active panel content when open", () => {
    renderAppMenu({ isOpen: true, activePanel: "language" });

    expect(
      screen.getByRole("button", { name: "English" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Español" }),
    ).toBeInTheDocument();
  });

  it("does not render data source information directly in the menu body", () => {
    renderAppMenu({ isOpen: true });

    expect(
      screen.queryByRole("heading", { name: "About Meeteo" }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Open-Meteo"),
    ).not.toBeInTheDocument();
  });

  it("renders an information button that activates the app info panel", async () => {
    const user = userEvent.setup();
    const onActivePanelChange = jest.fn();

    renderAppMenu({
      isOpen: true,
      onActivePanelChange,
    });

    const infoButton = screen.getByRole("button", {
      name: "App information",
    });

    await user.click(infoButton);

    expect(onActivePanelChange).toHaveBeenCalledWith("info");
  });

  it("renders the app info panel content when active", () => {
    renderAppMenu({ isOpen: true, activePanel: "info" });

    expect(
      screen.getByRole("heading", { name: "Data sources" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Open-Meteo")).toBeInTheDocument();
    expect(screen.getByText("CAMS")).toBeInTheDocument();
    expect(screen.getByText("OpenStreetMap")).toBeInTheDocument();
    expect(screen.getByText("Version v1.0.0")).toBeInTheDocument();
    const authorLink = screen.getByText("Pablo López");

    expect(authorLink).toHaveAttribute(
      "href",
      "https://github.com/pablopez",
    );
    expect(authorLink).toHaveAttribute("target", "_blank");
    expect(authorLink).toHaveAttribute("rel", "noreferrer");
    expect(screen.getByText(`© ${new Date().getFullYear()}`)).toBeInTheDocument();
  });

  it("closes the app info panel when toggled again", async () => {
    const user = userEvent.setup();
    const onActivePanelChange = jest.fn();

    renderAppMenu({
      isOpen: true,
      activePanel: "info",
      onActivePanelChange,
    });

    await user.click(
      screen.getByRole("button", { name: "App information" }),
    );

    expect(onActivePanelChange).toHaveBeenCalledWith(null);
  });
});
