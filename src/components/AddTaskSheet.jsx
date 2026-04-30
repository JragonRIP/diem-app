import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function AddTaskSheet({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [repeatDaily, setRepeatDaily] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, time, note, repeatDaily });
    setTitle("");
    setTime("");
    setNote("");
    setRepeatDaily(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 bg-black/58 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.form
            className="panel absolute bottom-0 w-full rounded-t-3xl p-5 shadow-luxe"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 285, damping: 31 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
          >
            <div className="mx-auto mb-3 h-1.5 w-11 rounded-full bg-current/20" />
            <h3 className="font-heading text-3xl tracking-wide">New Task</h3>
            <div className="mt-4 space-y-3">
              <input className="diem-input" placeholder="Task name" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input className="diem-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              <textarea className="diem-input min-h-24" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
              <button type="button" onClick={() => setRepeatDaily((v) => !v)} className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-4 ${repeatDaily ? "border-gold text-gold" : "border-current/20"}`}>
                <span>Repeat daily</span>
                <span>{repeatDaily ? "On" : "Off"}</span>
              </button>
            </div>
            <button type="submit" className="mt-5 min-h-11 w-full rounded-xl bg-gold font-semibold text-base">
              Add
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
