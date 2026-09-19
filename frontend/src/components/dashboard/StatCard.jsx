function StatCard({
  title,
  value,
  icon,
  gradient = "from-slate-500/10 to-slate-500/5",
  borderColor = "border-slate-200",
}) {
  return (
    <div
      className={`
        p-5
        rounded-2xl
        bg-gradient-to-br ${gradient}
        border ${borderColor}
        backdrop-blur-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-md
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>

        <div className="flex-shrink-0 p-2.5 bg-white rounded-xl shadow-sm">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}

export default StatCard;