import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import AddTaskSheet from "./components/AddTaskSheet";
import InstallPrompt from "./components/InstallPrompt";
import MiniCalendarModal from "./components/MiniCalendarModal";
import TaskCard from "./components/TaskCard";
import ThemeToggle from "./components/ThemeToggle";
import WeekStrip from "./components/WeekStrip";
import { useSwipe } from "./hooks/useSwipe";
import { createTask, formatDayKey, loadPlannerData, savePlannerData, sortTasks } from "./store/plannerStore";

const addDays = (date, n) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n);
  return copy;
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState(null);
  const [state, setState] = useState(loadPlannerData);
  const dayKey = formatDayKey(selectedDate);

  useEffect(() => savePlannerData(state), [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  const tasksForDay = useMemo(() => {
    const tasks = state.tasks.filter((task) => task.repeatDaily || task.dayKey === dayKey);
    return sortTasks(tasks);
  }, [dayKey, state.tasks]);

  const doneSet = new Set(state.completedByDay[dayKey] || []);
  const completedCount = tasksForDay.filter((task) => doneSet.has(task.id)).length;
  const progress = tasksForDay.length ? (completedCount / tasksForDay.length) * 100 : 0;

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => setSelectedDate((d) => addDays(d, 1)),
    onSwipeRight: () => setSelectedDate((d) => addDays(d, -1)),
  });

  const updateCompletion = (taskId) => {
    setState((prev) => {
      const next = new Set(prev.completedByDay[dayKey] || []);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return { ...prev, completedByDay: { ...prev.completedByDay, [dayKey]: [...next] } };
    });
  };

  const deleteTask = (taskId) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
      completedByDay: Object.fromEntries(
        Object.entries(prev.completedByDay).map(([k, ids]) => [k, ids.filter((id) => id !== taskId)])
      ),
    }));
  };

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-xl flex-col overflow-x-clip px-4 pb-24 font-body"
      style={{
        paddingTop: "max(1.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(6rem, calc(1.5rem + env(safe-area-inset-bottom)))",
      }}
      {...(sheetOpen ? {} : swipeHandlers)}
    >
      <header className="mb-5">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-heading text-4xl tracking-[0.06em]">Diem</h1>
          <div className="flex items-center gap-2">
            <button type="button" className="panel min-h-11 min-w-11 rounded-xl" onClick={() => setCalendarOpen(true)} aria-label="Open calendar">
              📅
            </button>
            <ThemeToggle
              theme={state.theme}
              onToggle={() => setState((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }))}
            />
          </div>
        </div>
        <WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </header>

      <section className="mb-5">
        <h2 className="font-heading text-4xl leading-tight tracking-[0.02em]">
          {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {completedCount} of {tasksForDay.length} complete
        </p>
        <div className="mt-2 h-1 w-full rounded-full bg-current/15">
          <motion.div className="h-1 rounded-full bg-gold" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={dayKey}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="space-y-3"
        >
          {tasksForDay.length === 0 && <p className="pt-16 text-center text-current/55">Nothing yet. Make it count.</p>}
          <AnimatePresence>
            {tasksForDay.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                done={doneSet.has(task.id)}
                onToggleDone={updateCompletion}
                onDelete={deleteTask}
                onUpdate={(taskId, patch) =>
                  setState((prev) => ({
                    ...prev,
                    tasks: prev.tasks.map((taskEntry) => (taskEntry.id === taskId ? { ...taskEntry, ...patch } : taskEntry)),
                  }))
                }
              />
            ))}
          </AnimatePresence>
        </motion.section>
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="fixed bottom-8 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-3xl text-base shadow-luxe"
        onClick={() => setSheetOpen(true)}
        aria-label="Add task"
      >
        +
      </motion.button>

      <AddTaskSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={(payload) =>
          setState((prev) => ({
            ...prev,
            tasks: [...prev.tasks, createTask({ ...payload, dayKey })],
          }))
        }
      />
      <MiniCalendarModal open={calendarOpen} selectedDate={selectedDate} onClose={() => setCalendarOpen(false)} onSelectDate={setSelectedDate} />
      <InstallPrompt
        visible={Boolean(installEvent) && !state.installPromptSeen}
        onDismiss={() => setState((prev) => ({ ...prev, installPromptSeen: true }))}
        onInstall={async () => {
          if (!installEvent) return;
          installEvent.prompt();
          await installEvent.userChoice;
          setState((prev) => ({ ...prev, installPromptSeen: true }));
          setInstallEvent(null);
        }}
      />
    </main>
  );
}
