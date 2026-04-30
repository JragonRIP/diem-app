import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLongPress } from "../hooks/useLongPress";

const formatTime = (timeValue) => {
  if (!timeValue) return "";
  const [hours, mins] = timeValue.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, mins, 0, 0);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

export default function TaskCard({ task, done, onToggleDone, onDelete, onUpdate }) {
  const [open, setOpen] = useState(false);
  const pressHandlers = useLongPress(() => onDelete(task.id), 550);

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -48 }} transition={{ duration: 0.24, ease: "easeOut" }} className={`panel rounded-2xl p-3 ${done ? "opacity-55" : ""}`}>
      <div className="flex items-start gap-3" {...pressHandlers}>
        <button type="button" className={`mt-1 h-6 w-6 rounded-full border transition ${done ? "border-gold bg-gold" : "border-current/40 hover:border-gold/70"}`} onClick={() => onToggleDone(task.id)} aria-label="Complete task" />
        <button type="button" className="flex-1 text-left" onClick={() => setOpen((v) => !v)}>
          <p className={`font-medium leading-6 ${done ? "line-through decoration-gold decoration-2" : ""}`}>{task.title}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-current/70">
            {task.time && <span>🕒 {formatTime(task.time)}</span>}
            {task.repeatDaily && <span className="text-gold">↻ Daily</span>}
          </div>
        </button>
        <button type="button" className="min-h-11 min-w-11 text-current/55" onClick={() => onDelete(task.id)} aria-label="Delete task">
          ✕
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <textarea
              className="diem-input mt-3 min-h-20"
              value={task.note}
              onChange={(e) => onUpdate(task.id, { note: e.target.value })}
              placeholder="Add detail..."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
