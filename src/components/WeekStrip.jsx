const addDays = (date, n) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + n);
  return copy;
};

export default function WeekStrip({ selectedDate, onSelectDate }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i - 3));
  const selectedKey = selectedDate.toDateString();

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-current/10 p-2">
      {days.map((day) => {
        const isSelected = day.toDateString() === selectedKey;
        const isToday = day.toDateString() === new Date().toDateString();
        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => onSelectDate(day)}
            className={`min-h-11 min-w-11 rounded-xl px-2 py-1 text-center transition ${
              isSelected ? "bg-gold text-base" : "text-current/75 hover:bg-current/10"
            }`}
          >
            <p className="text-[10px] uppercase tracking-[0.25em]">{day.toLocaleDateString("en-US", { weekday: "short" })}</p>
            <p className={`text-sm font-semibold ${isToday && !isSelected ? "text-gold" : ""}`}>{day.getDate()}</p>
          </button>
        );
      })}
    </div>
  );
}
