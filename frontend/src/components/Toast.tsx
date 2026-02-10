"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ─── Types ───
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ModalOptions {
  type?: ToastType;
  title: string;
  message: string;
  sub?: string;
  buttonText?: string;
  onClose?: () => void;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  showModal: (options: ModalOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);
let _idCounter = 0;

// ─── Icons ───
const icons: Record<ToastType, string> = {
  success: "\u2705",
  error: "\u274C",
  warning: "\u26A0\uFE0F",
  info: "\u2139\uFE0F",
};

const bgColors: Record<ToastType, string> = {
  success: "border-green-500/30 bg-green-500/10",
  error: "border-red-500/30 bg-red-500/10",
  warning: "border-yellow-500/30 bg-yellow-500/10",
  info: "border-blue-500/30 bg-blue-500/10",
};

const textColors: Record<ToastType, string> = {
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-yellow-400",
  info: "text-blue-400",
};

const btnColors: Record<ToastType, string> = {
  success: "bg-green-600 hover:bg-green-500",
  error: "bg-red-600 hover:bg-red-500",
  warning: "bg-yellow-600 hover:bg-yellow-500",
  info: "bg-blue-600 hover:bg-blue-500",
};

// ─── Provider ───
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++_idCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const showModal = useCallback((options: ModalOptions) => {
    setModal(options);
  }, []);

  const closeModal = () => {
    if (modal?.onClose) modal.onClose();
    setModal(null);
  };

  return (
    <ToastContext.Provider value={{ toast, showModal }}>
      {children}

      {/* ── Toast Stack ── */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-5 py-3 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center gap-3 animate-slide-in min-w-[280px] max-w-[400px] ${bgColors[t.type]}`}
          >
            <span className="text-lg">{icons[t.type]}</span>
            <p className={`text-sm font-bold ${textColors[t.type]}`}>{t.message}</p>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-6">
          <div className="bg-slate-900 p-8 rounded-[2rem] w-full max-w-md border border-slate-700/50 shadow-2xl relative animate-modal-in">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${bgColors[modal.type || "info"]}`}>
                {icons[modal.type || "info"]}
              </div>
            </div>

            {/* Title */}
            <h2 className={`text-xl font-black text-center mb-3 ${textColors[modal.type || "info"]}`}>
              {modal.title}
            </h2>

            {/* Message */}
            <p className="text-sm text-slate-300 text-center leading-relaxed whitespace-pre-line mb-2">
              {modal.message}
            </p>

            {/* Sub message */}
            {modal.sub && (
              <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-line ${bgColors[modal.type || "info"]} ${textColors[modal.type || "info"]}`}>
                {modal.sub}
              </div>
            )}

            {/* Button */}
            <button
              onClick={closeModal}
              className={`mt-6 w-full py-3 rounded-xl font-black text-white transition-all ${btnColors[modal.type || "info"]}`}
            >
              {modal.buttonText || "OK"}
            </button>
          </div>
        </div>
      )}

      {/* ── Animations ── */}
      <style jsx global>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(80px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-modal-in { animation: modal-in 0.2s ease-out; }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
