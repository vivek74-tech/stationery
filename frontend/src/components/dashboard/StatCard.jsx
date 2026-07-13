function StatCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
}) {
  return (
    <div
      className={`${color} text-white rounded-xl shadow-lg p-6 hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-lg font-medium opacity-90">
            {title}
          </h3>

          <p className="text-3xl font-bold mt-3">
            {value}
          </p>
        </div>

        <div className="text-5xl">
          {icon}
        </div>

      </div>
    </div>
  );
}

export default StatCard;