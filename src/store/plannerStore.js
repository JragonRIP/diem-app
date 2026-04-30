const STORAGE_KEY = "diem-planner-v1";

export const formatDayKey = (date) => date.toISOString().slice(0, 10);

export const parseTimeToMinutes = (timeValue) => {
  if (!timeValue) return Number.POSITIVE_INFINITY;
  const [hours, minutes] = timeValue.split(":").map(Number);
  return hours * 60 + minutes;
};

export const sortTasks = (tasks) =>
  [...tasks].sort((a, b) => {
    const aTime = parseTimeToMinutes(a.time);
    const bTime = parseTimeToMinutes(b.time);
    if (aTime !== bTime) return aTime - bTime;
    return a.createdAt - b.createdAt;
  });

export const loadPlannerData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: [], completedByDay: {}, theme: "dark", installPromptSeen: false };
    const parsed = JSON.parse(raw);
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      completedByDay: parsed.completedByDay || {},
      theme: parsed.theme === "light" ? "light" : "dark",
      installPromptSeen: Boolean(parsed.installPromptSeen),
    };
  } catch {
    return { tasks: [], completedByDay: {}, theme: "dark", installPromptSeen: false };
  }
};

export const savePlannerData = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const createTask = ({ title, time, note, repeatDaily, dayKey }) => ({
  id: crypto.randomUUID(),
  title: title.trim(),
  time: time || "",
  note: note.trim(),
  repeatDaily,
  dayKey,
  createdAt: Date.now(),
});
