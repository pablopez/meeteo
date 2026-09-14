import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  ToastProvider,
  useToast,
} from "@/shared/lib/toast";

function ToastTrigger() {
  const toast = useToast();

  return (
    <button
      type="button"
      onClick={() => toast.success("City added")}
    >
      Add toast
    </button>
  );
}

describe("ToastProvider", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows and manually closes a toast", async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Add toast" }));

    expect(screen.getByText("City added")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Close notification" }),
    );

    expect(screen.queryByText("City added")).not.toBeInTheDocument();
  });

  it("removes a toast automatically after three seconds", () => {
    jest.useFakeTimers();

    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    act(() => {
      screen.getByRole("button", { name: "Add toast" }).click();
    });

    expect(screen.getByText("City added")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText("City added")).not.toBeInTheDocument();
  });
});
