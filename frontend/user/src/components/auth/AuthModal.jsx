
export default function AuthModal({
  children,
  onClose,
}) {
  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full
          max-w-md
          min-h-[580px]
          max-h-[90vh]
          overflow-y-auto
          rounded-xl
          bg-white
          p-4
          sm:p-6
          shadow-xl
        "
      >
        {children}
      </div>
    </div>
  );
}