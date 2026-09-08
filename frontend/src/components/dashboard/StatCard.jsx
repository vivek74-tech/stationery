function StatCard({ title, value, icon, gradient, borderColor }) {
  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} border ${borderColor} backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-white rounded-xl shadow-xs">{icon}</div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

export default StatCard;