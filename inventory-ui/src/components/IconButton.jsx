export default function IconButton({
  variant = "outline",
  title,
  onClick,
  className = "",
  children,
  ...props
}) {
  const base = "inline-grid place-items-center rounded-md h-9 w-9 transition";
  const variants = {
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 " +
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300",
    danger:
      "bg-rose-600 text-white hover:bg-rose-500 " +
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600",
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[base, variants[variant], className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
