import { AnimatePresence, motion } from "framer-motion";

export default function InstallPrompt({ visible, onInstall, onDismiss }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-gold/40 bg-[var(--card)] p-4 shadow-luxe">
          <p className="text-sm">Add Diem to your home screen for a full native feel.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" className="min-h-11 flex-1 rounded-xl bg-gold text-base font-semibold" onClick={onInstall}>
              Add to Home Screen
            </button>
            <button type="button" className="min-h-11 rounded-xl border border-current/20 px-4" onClick={onDismiss}>
              Later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
