"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DataTable, TableColumnDef } from "@/components/ui/Table";
import { Label } from "@/components/ui/Label";
import { DetallePresupuestoForm } from "@/components/features/DetallePresupuestoForm";
import { presupuestoService } from "@/services/presupuesto.service";
import { detallePresupuestoService } from "@/services/detalle-presupuesto.service";
import type {
  DetallePresupuesto,
  DetallePresupuestoListResponse,
  GetPresupuestoResult,
  PresupuestoListResponse,
} from "@/types/api";

const currencyFormatter = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
  minimumFractionDigits: 2,
});

const estadoColors: Record<string, "success" | "default" | "warning" | "danger" | "info"> = {
  activo: "success",
  cerrado: "default",
  borrador: "warning",
  inactivo: "default",
};

export default function PresupuestoDetallePage() {
  const params = useParams<{ id_presupuesto: string }>();
  const router = useRouter();
  const presupuestoId = Number(params?.id_presupuesto);

  const [presupuesto, setPresupuesto] = useState<GetPresupuestoResult | null>(null);
  const [detalles, setDetalles] = useState<DetallePresupuesto[]>([]);
  const [loadingBudget, setLoadingBudget] = useState(true);
  const [loadingDetalles, setLoadingDetalles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(presupuestoId)) {
      setError("Identificador de presupuesto inválido");
      setLoadingBudget(false);
      setLoadingDetalles(false);
      return;
    }

    loadPresupuesto();
    loadDetalles();
  }, [presupuestoId]);

  const loadPresupuesto = async () => {
    try {
      setLoadingBudget(true);
      const response: PresupuestoListResponse = await presupuestoService.getById(presupuestoId);
      setPresupuesto(response.results?.[0] ?? null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando presupuesto");
    } finally {
      setLoadingBudget(false);
    }
  };

  const loadDetalles = async () => {
    try {
      setLoadingDetalles(true);
      const response: DetallePresupuestoListResponse = await detallePresupuestoService.listByPresupuesto(presupuestoId);
      setDetalles(response.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando detalle de presupuesto");
    } finally {
      setLoadingDetalles(false);
    }
  };

  const handleDetalleSuccess = () => {
    setShowForm(false);
    loadDetalles(); // Refresh the detalles list
  };

  const columns: TableColumnDef<DetallePresupuesto>[] = useMemo(
    () => [
      {
        id: "subcategoria",
        header: "Subcategoría",
        accessorKey: "subcategoria_id",
      },
      {
        id: "monto",
        header: "Monto mensual",
        accessorKey: "monto_mensual",
      },
      {
        id: "observaciones",
        header: "Notas",
        accessorKey: "observaciones",
      },
      {
        id: "estado",
        header: "Estado",
        accessorKey: "estado",
      },
    ],
    []
  );

  const loading = loadingBudget || loadingDetalles;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-600 text-white px-8 py-10 shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="uppercase text-xs tracking-[0.4em] text-blue-200">Detalle</p>
            <h1 className="text-4xl font-semibold mt-4">
              {presupuesto?.nombre_presupuesto ?? "Presupuesto"}
            </h1>
            {presupuesto && (
              <div className="mt-4 text-blue-100 text-sm space-y-1">
                <p>
                  Vigencia: {presupuesto.mes_inicio}/{presupuesto.anio_inicio} - {presupuesto.mes_fin}/{presupuesto.anio_fin}
                </p>
                <p>Creado: {new Date(presupuesto.creado_en).toLocaleDateString("es-HN")}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 min-w-[220px]">
            {presupuesto && (
              <Label variant={estadoColors[presupuesto.estado] ?? "default"} className="self-start px-4 py-1 text-sm">
                {presupuesto.estado}
              </Label>
            )}
            <button
              onClick={() => router.push("/dashboard/presupuestos")}
              className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              Volver al listado
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="rounded-3xl bg-white border border-slate-100 p-6 shadow-md">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Ingresos</p>
          <h3 className="text-3xl font-semibold text-emerald-600 mt-3">
            {currencyFormatter.format(presupuesto?.total_ingresos_planificados ?? 0)}
          </h3>
        </article>
        <article className="rounded-3xl bg-white border border-slate-100 p-6 shadow-md">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Gastos</p>
          <h3 className="text-3xl font-semibold text-rose-600 mt-3">
            {currencyFormatter.format(presupuesto?.total_gastos_planificados ?? 0)}
          </h3>
        </article>
        <article className="rounded-3xl bg-white border border-slate-100 p-6 shadow-md">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Ahorro</p>
          <h3 className="text-3xl font-semibold text-slate-900 mt-3">
            {currencyFormatter.format(presupuesto?.total_ahorro_planificado ?? 0)}
          </h3>
        </article>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-200/40 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Distribución</p>
            <h2 className="text-2xl font-semibold text-slate-900">Detalle por subcategoría</h2>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Configurar distribución
          </button>
        </div>
        <DataTable
          data={detalles}
          columns={columns}
          getRowId={(row) => row.id}
          isLoading={loading}
          emptyMessage="Aún no has definido subcategorías para este presupuesto"
        />
      </section>

      {showForm && (
        <DetallePresupuestoForm
          presupuestoId={presupuestoId}
          onSuccess={handleDetalleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
