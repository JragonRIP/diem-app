import { motion } from "framer-motion";

export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="panel relative h-11 w-20 rounded-full p-1"
      aria-label="Toggle theme"
    >
      <motion.span
        className="absolute inset-y-1 left-1 w-9 rounded-full bg-gold shadow-md"
        animate={{ x: dark ? 36 : 0 }}
        transition={{ type: "spring", stiffness: 330, damping: 28 }}
      />
      <span className="relative z-10 flex h-full items-center justify-between px-2 text-[10px] font-semibold tracking-[0.12em] text-current/75">
        <span>DK</span>
        <span>LT</span>
      </span>
    </button>
  );
}
