export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Ingresos</h3>
          <p className="text-2xl font-bold text-green-600">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Gastos</h3>
          <p className="text-2xl font-bold text-red-600">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Balance</h3>
          <p className="text-2xl font-bold text-slate-900">$0.00</p>
        </div>
      </div>
    </div>
  );
}