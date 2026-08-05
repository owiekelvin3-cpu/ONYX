export default function DashboardLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex justify-between">
        <div className="h-6 w-32 bg-bg-hover rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-bg-hover rounded" />
          <div className="h-8 w-16 bg-bg-hover rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-bg-secondary border border-border rounded-lg" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-72 bg-bg-secondary border border-border rounded-lg" />
        <div className="h-72 bg-bg-secondary border border-border rounded-lg" />
      </div>
      <div className="h-64 bg-bg-secondary border border-border rounded-lg" />
    </div>
  );
}
