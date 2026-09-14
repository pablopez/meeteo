export type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
};

const TYPE_CLASS_NAMES: Record<ToastType, string> = {
  success: "border-emerald-500 bg-emerald-50 text-emerald-950",
  error: "border-danger bg-red-50 text-red-950",
  info: "border-primary bg-blue-50 text-blue-950",
};

export function Toast({
  message,
  type,
  onClose,
}: ToastProps) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-all duration-300 ${TYPE_CLASS_NAMES[type]}`}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="shrink-0 rounded p-1 font-bold opacity-70 transition-opacity hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
