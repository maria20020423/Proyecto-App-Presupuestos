"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, TableColumnDef, ActionColumnConfig } from "@/components/ui/Table";
import { Label } from "@/components/ui/Label";
import { presupuestoService } from "@/services/presupuesto.service";
import { authStorage } from "@/services/apiClient";
import type { CreatePresupuestoDto, GetPresupuestoResult, PresupuestoEstado } from "@/types/api";

const INITIAL_FORM: CreatePresupuestoDto = {
  nombre_presupuesto: "",
  anio_inicio: new Date().getFullYear(),
  mes_inicio: new Date().getMonth() + 1,
  anio_fin: new Date().getFullYear(),
  mes_fin: Math.min(12, new Date().getMonth() + 4),
  total_ingresos_planificados: 0,
  total_gastos_planificados: 0,
  total_ahorro_planificado: 0,
  fecha_creacion: new Date().toISOString(),
  estado: "activo",
  creado_en: new Date().toISOString(),
};

const estadoOptions: Array<{ value: PresupuestoEstado; label: string; description: string }> = [
  { value: "activo", label: "Activo", description: "Disponible inmediatamente para registrar movimientos." },
  { value: "borrador", label: "Borrador", description: "Solo planificación: podrás activarlo más tarde." },
];

const currencyFormatter = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
  minimumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat("es-HN", { month: "short" });

function periodLabel(year: number, month: number): string {
  const date = new Date(year, month - 1, 1);
  return `${monthFormatter.format(date).toUpperCase()} ${year}`;
}

const estadoVariant: Record<PresupuestoEstado, "success" | "warning" | "default"> = {
  activo: "success",
  cerrado: "default",
  borrador: "warning",
};

export default function PresupuestosPage() {
  const router = useRouter();
  const [presupuestos, setPresupuestos] = useState<GetPresupuestoResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreatePresupuestoDto>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const loadPresupuestos = async () => {
    const userId = authStorage.getUserId();
    if (!userId) {
      setError("Necesitas iniciar sesión para ver tus presupuestos");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await presupuestoService.getAll(userId);
      setPresupuestos(response.results ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando presupuestos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresupuestos();
  }, []);

  const handleCreatePresupuesto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId = authStorage.getUserId();
    if (!userId) {
      setError("Inicia sesión para crear presupuestos");
      return;
    }

    setSubmitting(true);
    try {
      const result = await presupuestoService.create(userId, formData);
      if (result?.id_presupuesto) {
        // Opcional: redirigir directamente al detalle del nuevo presupuesto
        router.push(`/dashboard/presupuestos/${result.id_presupuesto}`);
      }
      setShowForm(false);
      setFormData(INITIAL_FORM);
      await loadPresupuestos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el presupuesto");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumnDef<GetPresupuestoResult>[] = useMemo(
    () => [
      {
        id: "nombre",
        header: "Presupuesto",
        accessorKey: "nombre_presupuesto",
      },
      {
        id: "periodo",
        header: "Vigencia",
        cell: ({ row }) => {
          const presupuesto = row.original;
          return (
            <div>
              <p className="text-sm font-medium text-slate-900">
                {periodLabel(presupuesto.anio_inicio, presupuesto.mes_inicio)}
              </p>
              <p className="text-xs text-slate-500">
                hasta {periodLabel(presupuesto.anio_fin, presupuesto.mes_fin)}
              </p>
            </div>
          );
        },
      },
      {
        id: "totales",
        header: "Totales planificados",
        cell: ({ row }) => (
          <div className="text-sm text-slate-700">
            <span className="font-semibold text-emerald-600">
              {currencyFormatter.format(row.original.total_ingresos_planificados)}
            </span>
            <span className="mx-2 text-slate-400">/</span>
            <span className="font-semibold text-rose-600">
              {currencyFormatter.format(row.original.total_gastos_planificados)}
            </span>
          </div>
        ),
      },
      {
        id: "ahorro",
        header: "Ahorro",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-900">
            {currencyFormatter.format(row.original.total_ahorro_planificado)}
          </span>
        ),
      },
      {
        id: "estado",
        header: "Estado",
        accessorKey: "estado",
        cell: ({ row }) => (
          <Label variant={estadoVariant[row.original.estado]}>{row.original.estado}</Label>
        ),
      },
    ],
    []
  );

  const actionConfig: ActionColumnConfig<GetPresupuestoResult> = {
    customActions: [
      {
        label: "Ver Detalle",
        onClick: (row) => router.push(`/dashboard/presupuestos/${row.id_presupuesto}`),
        variant: "outline",
      },
    ],
  };

  const handleInputChange = (
    key: keyof CreatePresupuestoDto,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "number" ? Number(value) : value,
    }));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 text-white px-10 py-10 shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-blue-200">Panel</p>
            <h1 className="text-4xl font-semibold mt-3">Presupuestos Personales</h1>
            <p className="text-blue-100 mt-4 max-w-2xl">
              Administra la vigencia, los objetivos mensuales y el detalle de gasto de cada plan financiero.
              Desde aquí puedes crear presupuestos completos y acceder al detalle de subcategorías en segundos.
            </p>
          </div>
          <div className="flex flex-col gap-3 min-w-[220px]">
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              Crear presupuesto
            </button>
            <span className="text-sm text-blue-100">Configura los ingresos, gastos y ahorro planificado para tu presupuesto.</span>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">
          {error}
        </div>
      )}

      {showForm && (
        <section className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Nuevo</p>
              <h2 className="text-2xl font-semibold text-slate-900">Crear presupuesto</h2>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Cerrar
            </button>
          </div>
          <form onSubmit={handleCreatePresupuesto} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre_presupuesto}
                  onChange={(e) => handleInputChange("nombre_presupuesto", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Presupuesto H1 2025"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Año inicio</label>
                <input
                  type="number"
                  value={formData.anio_inicio}
                  onChange={(e) => handleInputChange("anio_inicio", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  min={2000}
                  max={2100}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Mes inicio</label>
                <input
                  type="number"
                  value={formData.mes_inicio}
                  onChange={(e) => handleInputChange("mes_inicio", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  min={1}
                  max={12}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Año fin</label>
                <input
                  type="number"
                  value={formData.anio_fin}
                  onChange={(e) => handleInputChange("anio_fin", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  min={formData.anio_inicio}
                  max={2100}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Mes fin</label>
                <input
                  type="number"
                  value={formData.mes_fin}
                  onChange={(e) => handleInputChange("mes_fin", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  min={1}
                  max={12}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-600">Estado inicial</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {estadoOptions.map((option) => {
                  const isSelected = formData.estado === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, estado: option.value }))}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-900 shadow-lg"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <p className="font-semibold">{option.label}</p>
                      <p className="text-sm mt-1 opacity-80">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Ingresos planificados</label>
                <input
                  type="number"
                  value={formData.total_ingresos_planificados}
                  onChange={(e) => handleInputChange("total_ingresos_planificados", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Gastos planificados</label>
                <input
                  type="number"
                  value={formData.total_gastos_planificados}
                  onChange={(e) => handleInputChange("total_gastos_planificados", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Ahorro esperado</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total_ahorro_planificado}
                  onChange={(e) => handleInputChange("total_ahorro_planificado", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-slate-800 transition disabled:bg-slate-400"
              >
                {submitting ? "Guardando..." : "Guardar presupuesto"}
              </button>
              <p className="text-sm text-slate-500">Este proceso crea el presupuesto básico listo para configurar detalles.</p>
            </div>
          </form>
        </section>
      )}

      <section className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-200/40 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Listado</p>
            <h2 className="text-2xl font-semibold text-slate-900">Presupuestos activos y cerrados</h2>
          </div>
          <div className="text-sm text-slate-500">
            {presupuestos.length} presupuestos registrados
          </div>
        </div>
        <DataTable
          data={presupuestos}
          columns={columns}
          actionConfig={actionConfig}
          getRowId={(row) => row.id_presupuesto}
          isLoading={loading}
          emptyMessage="Aún no tienes presupuestos configurados"
          onRowClick={(row) => router.push(`/dashboard/presupuestos/${row.id_presupuesto}`)}
        />
      </section>
    </div>
  );
}
