'use client';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 left-64 right-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Bienvenido a HiFin
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
            Cerrar sesión
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
            U
          </div>
        </div>
      </div>
    </header>
  );
}