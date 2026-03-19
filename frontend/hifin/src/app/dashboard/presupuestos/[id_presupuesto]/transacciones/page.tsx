"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DataTable, TableColumnDef, ActionColumnConfig } from "@/components/ui/Table";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { transaccionesService } from "@/services/transacciones.service";
import { authStorage } from "@/services/apiClient";
import type { Transaccion } from "@/types/api";
import { TransaccionForm } from "@/app/dashboard/presupuestos/components/TransaccionForm";

const currencyFormatter = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
  minimumFractionDigits: 2,
});

const tipoVariant: Record<string, "success" | "danger" | "default" | "warning" | "info"> = {
  ingreso: "success",
  gasto: "danger",
};

export default function TransaccionesPresupuestoPage() {
  const params = useParams<{ id_presupuesto: string }>();
  const router = useRouter();
  const presupuestoId = Number(params?.id_presupuesto);

  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadTransacciones = async () => {
    if (!Number.isFinite(presupuestoId)) {
      setError("ID de presupuesto inválido");
      setLoading(false);
      return;
    }

    const userId = authStorage.getUserId();
    if (!userId) {
      setError("Necesitas iniciar sesión");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await transaccionesService.getByPresupuesto(presupuestoId);
      setTransacciones(response.results ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando transacciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransacciones();
  }, [presupuestoId]);

  const handleGoBack = () => {
    router.push(`/dashboard/presupuestos/${presupuestoId}`);
  };

  const handleSuccess = () => {
    setShowForm(false);
    loadTransacciones();
  };

  const columns: TableColumnDef<Transaccion>[] = useMemo(
    () => [
      {
        id: "fecha",
        header: "Fecha",
        accessorKey: "fecha",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {new Date(row.original.fecha).toLocaleDateString("es-HN")}
          </span>
        ),
      },
      {
        id: "tipo",
        header: "Tipo",
        accessorKey: "tipo",
        cell: ({ row }) => (
          <Label variant={tipoVariant[row.original.tipo] ?? "default"}>
            {row.original.tipo}
          </Label>
        ),
      },
      {
        id: "descripcion",
        header: "Descripción",
        accessorKey: "descripcion",
        cell: ({ row }) => (
          <span className="text-sm text-slate-700">
            {row.original.descripcion ?? "—"}
          </span>
        ),
      },
      {
        id: "monto",
        header: "Monto",
        accessorKey: "monto",
        cell: ({ row }) => (
          <span
            className={`text-sm font-semibold ${
              row.original.tipo === "ingreso" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {currencyFormatter.format(row.original.monto ?? 0)}
          </span>
        ),
      },
      {
        id: "metodo_pago",
        header: "Método de Pago",
        accessorKey: "metodo_pago",
        cell: ({ row }) => (
          <span className="text-sm text-slate-600">
            {row.original.metodo_pago ?? "—"}
          </span>
        ),
      },
      {
        id: "no_factura",
        header: "No. Factura",
        accessorKey: "no_factura",
        cell: ({ row }) => (
          <span className="text-sm text-slate-500">
            {row.original.no_factura ?? "—"}
          </span>
        ),
      },
      {
        id: "estado",
        header: "Estado",
        accessorKey: "estado",
        cell: ({ row }) => (
          <Label variant={row.original.estado === "activo" ? "success" : "default"}>
            {row.original.estado}
          </Label>
        ),
      },
    ],
    []
  );

  const actionConfig: ActionColumnConfig<Transaccion> = {
    customActions: [
      {
        label: "Editar",
        onClick: (row) => {
          // TODO: Implement edit
          console.log("Editar transacción:", row.id);
        },
        variant: "outline",
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 text-white px-8 py-10 shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="uppercase text-xs tracking-[0.4em] text-blue-200">Transacciones</p>
            <h1 className="text-4xl font-semibold mt-4">
              Transacciones del Presupuesto
            </h1>
            <p className="mt-4 text-blue-100 text-sm">
              ID Presupuesto: {presupuestoId} • {transacciones.length} transacciones registradas
            </p>
          </div>
          <div className="flex flex-col gap-3 min-w-[220px]">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-emerald-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              Registrar Transacción
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              Volver al presupuesto
            </Button>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">
          {error}
        </div>
      )}

      {/* Table */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-200/40 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Listado</p>
            <h2 className="text-2xl font-semibold text-slate-900">Todas las transacciones</h2>
          </div>
          <div className="text-sm text-slate-500">
            {transacciones.length} transacciones encontradas
          </div>
        </div>
        <DataTable
          data={transacciones}
          columns={columns}
          actionConfig={actionConfig}
          getRowId={(row) => row.id}
          isLoading={loading}
          emptyMessage="No hay transacciones registradas para este presupuesto"
        />
      </section>

      {showForm && (
        <TransaccionForm
          presupuestoId={presupuestoId}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
