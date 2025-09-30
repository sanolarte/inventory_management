import React from "react";

const base =
  "inline-flex items-center justify-center rounded-md font-semibold " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:opacity-60 disabled:cursor-not-allowed transition";

const sizes = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm/6",
  lg: "px-4 py-2 text-base/6",
};

const variants = {
  primary:
    "bg-cyan-600 text-white shadow-xs hover:bg-cyan-500 " +
    "focus-visible:outline-cyan-600 " +
    "dark:bg-cyan-500 dark:shadow-none dark:hover:bg-cyan-400 dark:focus-visible:outline-cyan-500",
  neutral:
    "bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline-gray-900 " +
    "dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:focus-visible:outline-white/10",
  outline:
    "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:outline-gray-300 " +
    "dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:focus-visible:outline-white/10",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-600 " +
    "dark:bg-rose-500 dark:hover:bg-rose-400 dark:focus-visible:outline-rose-500",
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
  leftIcon = null,
  rightIcon = null,
  onClick,              
  title,
  ...props
}) {
  const cls = [
    base,
    sizes[size],
    variants[variant],
    fullWidth ? "w-full" : "",
    loading ? "cursor-wait" : "",
    className,
  ].filter(Boolean).join(" ");

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : "false"}
      onClick={handleClick}
      title={title}
      {...props}
    >
      {/* Left icon / spinner */}
      <span className="mr-2 inline-flex">
        {loading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (leftIcon)}
      </span>

      <span className={loading ? "opacity-90" : ""}>{children}</span>

      <span className="ml-2 inline-flex">
        {!loading && rightIcon ? rightIcon : null}
      </span>
    </button>
  );
}
