// src/components/ui/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={onClose} // clic hors modal ferme
    >
      <div
        className="bg-light p-6 rounded-xl shadow-xl w-full max-w-4xl relative font-sans"
        onClick={e => e.stopPropagation()} // empêcher fermeture au clic dans la modal
      >
        {title && (
          <h2
            id="modal-title"
            className="text-primary text-2xl font-heading font-semibold mb-6 select-none"
          >
            {title}
          </h2>
        )}
        <button
          onClick={onClose}
          aria-label="Fermer la fenêtre modale"
          className="absolute top-4 right-4 text-primary hover:text-secondary transition focus:outline-none focus:ring-2 focus:ring-secondary rounded"
          type="button"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}