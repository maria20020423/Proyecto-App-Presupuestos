"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, TableColumnDef, ActionColumnConfig } from "@/components/ui/Table";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  ObligacionFija,
  CreateObligacionFijaDto,
  UpdateObligacionFijaDto,
  Categoria,
  Subcategoria,
} from "@/types/api";
import { obligacionFijaService } from "@/services/obligacion-fija.service";
import { categoriaService, subcategoriaService, authStorage } from "@/services/apiClient";

type FormMode = "create" | "edit";

const defaultForm: CreateObligacionFijaDto = {
  subcategoria_id: 0,
  nombre: "",
  descripcion: "",
  dia_mes_expiracion: 5,
  monto: 0,
  is_vigente: true,
  fecha_inicio: new Date().toISOString().slice(0, 10),
  fecha_final: null,
};

const currencyFormatter = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
});

export default function ObligacionesPage() {
  const [obligaciones, setObligaciones] = useState<ObligacionFija[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateObligacionFijaDto>(defaultForm);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = authStorage.getUserId();

  const loadObligaciones = async () => {
    if (!userId) {
      setError("Inicia sesión para ver tus obligaciones");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await obligacionFijaService.getAll(userId);
      setObligaciones(response.results ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las obligaciones fijas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadObligaciones();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!userId) return;
      try {
        const response = await categoriaService.getAll(userId);
        setCategorias(response.results ?? []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategorias();
  }, [userId]);

  useEffect(() => {
    const fetchSubcategorias = async () => {
      if (!selectedCategoria) {
        setSubcategorias([]);
        return;
      }
      try {
        const response = await subcategoriaService.getByCategoria(Number(selectedCategoria));
        setSubcategorias(response.results ?? []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubcategorias();
  }, [selectedCategoria]);

  const columns: TableColumnDef<ObligacionFija>[] = useMemo(
    () => [
      {
        id: "nombre",
        header: "Obligación",
        accessorKey: "nombre",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">{row.original.nombre}</p>
            <p className="text-xs text-slate-500">{row.original.descripcion}</p>
          </div>
        ),
      },
      {
        id: "monto",
        header: "Monto mensual",
        accessorKey: "monto",
        cell: ({ row }) => (
          <span className="font-semibold text-slate-900">{currencyFormatter.format(row.original.monto)}</span>
        ),
      },
      {
        id: "dia",
        header: "Día de vencimiento",
        accessorKey: "dia_mes_expiracion",
        cell: ({ row }) => <span>Día {row.original.dia_mes_expiracion}</span>,
      },
      {
        id: "vigencia",
        header: "Estado",
        accessorKey: "is_vigente",
        cell: ({ row }) => (
          <Label variant={row.original.is_vigente ? "success" : "warning"}>
            {row.original.is_vigente ? "Vigente" : "Pausada"}
          </Label>
        ),
      },
      {
        id: "vigencia_periodo",
        header: "Vigencia",
        cell: ({ row }) => (
          <div className="text-sm text-slate-600">
            <p>
              Desde {new Date(row.original.fecha_inicio).toLocaleDateString("es-HN", { month: "short", year: "numeric" })}
            </p>
            <p>
              Hasta {row.original.fecha_final
                ? new Date(row.original.fecha_final).toLocaleDateString("es-HN", { month: "short", year: "numeric" })
                : "Indefinida"}
            </p>
          </div>
        ),
      },
    ],
    []
  );

  const handleOpenForm = async (mode: FormMode, obligacion?: ObligacionFija) => {
    setFormMode(mode);
    setShowForm(true);
    if (mode === "edit" && obligacion) {
      setEditingId(obligacion.id);
      try {
        const subcategoriaResponse = await subcategoriaService.getById(obligacion.subcategoria_id);
        const subcategoria = subcategoriaResponse.results;
        if (subcategoria) {
          setSelectedCategoria(String(subcategoria.categoria_id));
          const response = await subcategoriaService.getByCategoria(subcategoria.categoria_id);
          setSubcategorias(response.results ?? []);
        }
      } catch (err) {
        console.error("No se pudo cargar la subcategoría", err);
      }
      setFormData({
        subcategoria_id: obligacion.subcategoria_id,
        nombre: obligacion.nombre,
        descripcion: obligacion.descripcion,
        dia_mes_expiracion: obligacion.dia_mes_expiracion,
        monto: obligacion.monto,
        is_vigente: obligacion.is_vigente,
        fecha_inicio: obligacion.fecha_inicio?.slice(0, 10) ?? null,
        fecha_final: obligacion.fecha_final?.slice(0, 10) ?? null,
      });
    } else {
      setEditingId(null);
      setFormData(defaultForm);
    }
  };

  const handleDelete = async (row: ObligacionFija) => {
    if (!confirm(`¿Eliminar obligación "${row.nombre}"?`)) return;
    try {
      await obligacionFijaService.delete(row.id);
      await loadObligaciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la obligación");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        await obligacionFijaService.create(userId, formData);
      } else if (editingId !== null) {
        await obligacionFijaService.update(userId, editingId, formData as UpdateObligacionFijaDto);
      }
      setShowForm(false);
      setFormData(defaultForm);
      await loadObligaciones();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la obligación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const actionConfig: ActionColumnConfig<ObligacionFija> = {
    onDelete: handleDelete,
    customActions: [
      {
        label: "Editar",
        onClick: (row) => handleOpenForm("edit", row),
        variant: "outline",
      },
    ],
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-cyan-600 px-10 py-10 text-white shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-cyan-200">Compromisos recurrentes</p>
            <h1 className="text-4xl font-semibold mt-3">Obligaciones fijas</h1>
            <p className="text-cyan-50 mt-4 max-w-2xl">
              Controla alquileres, seguros, préstamos y servicios con sus fechas de vencimiento y montos mensuales. Desde
              aquí puedes crear, pausar o ajustar cada obligación para anticipar pagos y evitar recargos.
            </p>
          </div>
          <div className="flex flex-col gap-3 min-w-[220px]">
            <button
              onClick={() => handleOpenForm("create")}
              className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              Registrar obligación
            </button>
            <span className="text-sm text-cyan-100">Define el monto, la subcategoría y la fecha objetivo por mes.</span>
          </div>
        </div>
      </section>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">{error}</div>}

      {showForm && (
        <section className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                {formMode === "create" ? "Nueva obligación" : "Editar obligación"}
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {formMode === "create" ? "Registrar obligación fija" : "Actualizar obligación fija"}
              </h2>
            </div>
            <button onClick={() => setShowForm(false)} className="text-sm text-slate-500 hover:text-slate-900">
              Cerrar
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Día de vencimiento</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={formData.dia_mes_expiracion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dia_mes_expiracion: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-600">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Categoría</label>
                <Select
                  value={selectedCategoria}
                  onChange={(e) => {
                    setSelectedCategoria(e.target.value);
                    setFormData((prev) => ({ ...prev, subcategoria_id: 0 }));
                  }}
                  options={categorias.map((categoria) => ({ value: categoria.id, label: categoria.nombre }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Subcategoría</label>
                <Select
                  value={formData.subcategoria_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subcategoria_id: Number(e.target.value) }))}
                  options={subcategorias.map((sub) => ({ value: sub.id, label: sub.nombre }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Monto mensual</label>
                <input
                  type="number"
                  min={0}
                  value={formData.monto}
                  onChange={(e) => setFormData((prev) => ({ ...prev, monto: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Fecha inicio</label>
                <input
                  type="date"
                  value={formData.fecha_inicio ?? ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fecha_inicio: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Fecha fin</label>
                <input
                  type="date"
                  value={formData.fecha_final ?? ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fecha_final: e.target.value || null }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formData.is_vigente}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_vigente: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Obligación activa
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-slate-800 transition disabled:bg-slate-400"
              >
                {isSubmitting ? "Guardando..." : formMode === "create" ? "Guardar" : "Actualizar"}
              </button>
              <p className="text-sm text-slate-500">Todas las obligaciones requieren subcategoría para reportes.</p>
            </div>
          </form>
        </section>
      )}

      <section className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-200/40 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Listado</p>
            <h2 className="text-2xl font-semibold text-slate-900">Obligaciones vigentes y pausadas</h2>
          </div>
          <div className="text-sm text-slate-500">{obligaciones.length} obligaciones registradas</div>
        </div>
        <DataTable
          data={obligaciones}
          columns={columns}
          actionConfig={actionConfig}
          getRowId={(row) => row.id}
          isLoading={loading}
          emptyMessage="Aún no has registrado obligaciones fijas"
        />
      </section>
    </div>
  );
}
