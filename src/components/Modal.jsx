export const Modal = ({
  isVisible,
  onClose,
  children,
  bgColor = "bg-white",
}) => {
  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-black/35 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative ${bgColor} rounded-lg shadow-xl
            w-[calc(100vw-2rem)] sm:w-[500px] md:w-[700px] 
            max-h-[calc(100vh-2rem)]
            mx-4 sm:mx-auto`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
