import { AnimatePresence, motion } from "framer-motion";

const buildMonthGrid = (date) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

export default function MiniCalendarModal({ open, selectedDate, onClose, onSelectDate }) {
  const cells = buildMonthGrid(selectedDate);
  const month = selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedKey = selectedDate.toDateString();

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-40 flex items-end bg-black/45 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full rounded-3xl border border-current/10 bg-[var(--card)] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-heading text-3xl">{month}</h2>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs uppercase text-current/70">
              {["S", "M", "T", "W", "T", "F", "S"].map((label) => <span key={label}>{label}</span>)}
              {cells.map((day) => {
                const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                const isSelected = day.toDateString() === selectedKey;
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => {
                      onSelectDate(day);
                      onClose();
                    }}
                    className={`min-h-11 rounded-lg text-sm ${isSelected ? "bg-gold text-base" : ""} ${isCurrentMonth ? "" : "text-current/35"}`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
