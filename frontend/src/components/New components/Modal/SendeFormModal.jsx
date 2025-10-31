import React, { useRef, useEffect } from "react";

function SendeFormModal({ open, handleClose, formId }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Close Button at page top-right corner */}
      <button
        onClick={() => handleClose(false)}
        className="fixed top-4 right-4 text-black text-2xl font-bold z-50 border border-gray-400 rounded-full w-10 h-10 flex items-center justify-center hover:border-black transition bg-white"
        aria-label="Close"
      >
        &times;
      </button>

      {/* Modal Content */}
      <div ref={modalRef} className="relative p-6 rounded-xl w-full max-w-2xl">
        <div
          className="sender-form-field w-full"
          data-sender-form-id={formId}
          style={{ textAlign: "center" }}
        ></div>
      </div>
    </div>
  );
}

export default SendeFormModal;
