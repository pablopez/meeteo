"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import { Button } from "../button";

type ConfirmModalVariant = "primary" | "danger";

export type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmVariant?: ConfirmModalVariant;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  body,
  confirmLabel,
  cancelLabel,
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "confirm-modal-title" : undefined}
        className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg"
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <h2
            id="confirm-modal-title"
            className="text-lg font-semibold text-white"
          >
            {title}
          </h2>
        )}

        <p className="mt-2 text-white">{body}</p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            label={cancelLabel}
            variant="secondary"
            onClick={onCancel}
          />

          <Button
            label={confirmLabel}
            variant={confirmVariant}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
