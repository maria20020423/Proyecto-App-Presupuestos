"use client";

import { useEffect, useMemo, useState } from "react";
import { metaAhorroService } from "@/services/meta-ahorro.service";
import { authStorage } from "@/services/apiClient";
import {
  MetaAhorro,
  MetaAhorroEstado,
  CreateMetaAhorroDto,
  UpdateMetaAhorroDto,
} from "@/types/api";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type FormMode = "create" | "edit";

interface MetaFormState {
  nombre: string;
  descripcion: string;
  monto_objetivo: string;
  monto_acumulado: string;
  fecha_objetivo: string;
  estado: MetaAhorroEstado;
  prioridad: string;
  promedio_ahorro_mensual: string;
  fecha_inicio: string;
  fecha_completada: string;
}

const currencyFormatter = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
  maximumFractionDigits: 0,
});

const estadoConfig: Record<MetaAhorroEstado, { label: string; color: string; badge: string }> = {
  activo: {
    label: "Activo",
    color: "bg-emerald-500/10 text-emerald-700",
    badge: "text-emerald-700",
  },
  completado: {
    label: "Completado",
    color: "bg-slate-900 text-white",
    badge: "text-slate-700",
  },
  pausado: {
    label: "Pausado",
    color: "bg-amber-100 text-amber-700",
    badge: "text-amber-600",
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-rose-100 text-rose-700",
    badge: "text-rose-600",
  },
};

const prioridadLabels: Record<string, string> = {
  "1": "Alta",
  "2": "Media",
  "3": "Baja",
};

const estadoOptions: { value: MetaAhorroEstado; label: string }[] = [
  { value: "activo", label: "Activo" },
  { value: "completado", label: "Completado" },
  { value: "pausado", label: "Pausado" },
  { value: "cancelado", label: "Cancelado" },
];

const prioridadOptions = [
  { value: "1", label: "Alta" },
  { value: "2", label: "Media" },
  { value: "3", label: "Baja" },
];

function getProgress(meta: MetaAhorro): number {
  if (!meta.monto_objetivo) return 0;
  return Math.min(100, Math.round((meta.monto_acumulado / meta.monto_objetivo) * 100));
}

function getDaysRemaining(deadline: string | null): number {
  if (!deadline) return 0;
  const today = new Date();
  const target = new Date(deadline);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function MetasAhorroPage() {
  const [metas, setMetas] = useState<MetaAhorro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [showForm, setShowForm] = useState(false);
  const [selectedMetaId, setSelectedMetaId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState<MetaFormState>({
    nombre: "",
    descripcion: "",
    monto_objetivo: "0",
    monto_acumulado: "0",
    fecha_objetivo: today,
    estado: "activo",
    prioridad: "1",
    promedio_ahorro_mensual: "",
    fecha_inicio: today,
    fecha_completada: "",
  });

  const userId = authStorage.getUserId();

  const loadMetas = async () => {
    if (!userId) {
      setError("Necesitas iniciar sesión para ver tus metas");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await metaAhorroService.getAll();
      const userMetas = (response.results ?? []).filter((meta) => meta.id_usuario === userId);
      setMetas(userMetas);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las metas de ahorro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetas();
  }, []);

  const summary = useMemo(() => {
    const totalObjetivo = metas.reduce((acc, meta) => acc + (meta.monto_objetivo ?? 0), 0);
    const totalAhorrado = metas.reduce((acc, meta) => acc + (meta.monto_acumulado ?? 0), 0);
    const metasEnAlerta = metas.filter((meta) => meta.estado === "pausado" || meta.estado === "cancelado").length;
    const metasCompletadas = metas.filter((meta) => meta.estado === "completado").length;
    const progresoPromedio = metas.length
      ? Math.round(metas.reduce((acc, meta) => acc + getProgress(meta), 0) / metas.length)
      : 0;

    return { totalObjetivo, totalAhorrado, metasEnAlerta, metasCompletadas, progresoPromedio };
  }, [metas]);

  const handleOpenForm = (mode: FormMode, meta?: MetaAhorro) => {
    setFormMode(mode);
    setShowForm(true);
    if (mode === "edit" && meta) {
      setSelectedMetaId(meta.id);
      setFormData({
        nombre: meta.nombre,
        descripcion: meta.descripcion ?? "",
        monto_objetivo: String(meta.monto_objetivo ?? 0),
        monto_acumulado: String(meta.monto_acumulado ?? 0),
        fecha_objetivo: meta.fecha_objetivo?.slice(0, 10) ?? today,
        estado: meta.estado,
        prioridad: String(meta.prioridad ?? 3),
        promedio_ahorro_mensual: meta.promedio_ahorro_mensual ? String(meta.promedio_ahorro_mensual) : "",
        fecha_inicio: meta.fecha_inicio?.slice(0, 10) ?? today,
        fecha_completada: meta.fecha_completada?.slice(0, 10) ?? "",
      });
    } else {
      setSelectedMetaId(null);
      setFormData({
        nombre: "",
        descripcion: "",
        monto_objetivo: "0",
        monto_acumulado: "0",
        fecha_objetivo: today,
        estado: "activo",
        prioridad: "1",
        promedio_ahorro_mensual: "",
        fecha_inicio: today,
        fecha_completada: "",
      });
    }
  };

  const handleDelete = async (meta: MetaAhorro) => {
    if (!confirm(`¿Eliminar la meta "${meta.nombre}"?`)) return;
    try {
      await metaAhorroService.delete(meta.id);
      await loadMetas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la meta de ahorro");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      setError("Necesitas iniciar sesión para registrar metas");
      return;
    }

    const payloadBase = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || null,
      monto_objetivo: Number(formData.monto_objetivo) || 0,
      monto_acumulado: Number(formData.monto_acumulado) || 0,
      fecha_objetivo: formData.fecha_objetivo,
      estado: formData.estado,
      prioridad: Number(formData.prioridad) || 3,
      promedio_ahorro_mensual: formData.promedio_ahorro_mensual
        ? Number(formData.promedio_ahorro_mensual)
        : null,
      fecha_inicio: formData.fecha_inicio,
      fecha_completada: formData.fecha_completada || null,
    };

    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        const createPayload: CreateMetaAhorroDto = {
          ...payloadBase,
        };
        await metaAhorroService.create(userId, createPayload);
      } else if (selectedMetaId) {
        const updatePayload: UpdateMetaAhorroDto = {
          ...payloadBase,
        };
        await metaAhorroService.update(userId, selectedMetaId, updatePayload);
      }
      setShowForm(false);
      await loadMetas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la meta de ahorro");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 px-10 py-12 text-white shadow-2xl">
        <p className="uppercase tracking-[0.4em] text-xs text-cyan-200">Ahorro estratégico</p>
        <div className="flex flex-col gap-8 mt-6 lg:flex-row lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-semibold">Metas de Ahorro</h1>
            <p className="text-cyan-50 text-lg">
              Visualiza el progreso mensual, anticipa riesgos por fecha objetivo y ajusta tus aportes antes de
              desviarte. La vista resume montos objetivo, acumulados y el ritmo de ahorro necesario para cerrar
              cada meta a tiempo.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 min-w-[260px]">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Progreso promedio</p>
              <p className="text-4xl font-semibold mt-2">{summary.progresoPromedio}%</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Metas completadas</p>
              <p className="text-4xl font-semibold mt-2">{summary.metasCompletadas}</p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Button
            onClick={() => handleOpenForm("create")}
            className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition"
          >
            Registrar meta
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Ahorro acumulado</p>
          <p className="text-3xl font-semibold text-slate-900">
            {currencyFormatter.format(summary.totalAhorrado)}
          </p>
          <p className="text-xs text-slate-400 mt-2">Corresponde al {summary.progresoPromedio}% del objetivo total.</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Objetivo consolidado</p>
          <p className="text-3xl font-semibold text-slate-900">
            {currencyFormatter.format(summary.totalObjetivo)}
          </p>
          <p className="text-xs text-slate-400 mt-2">Planifica liquidez para completar {metas.length} metas registradas.</p>
        </article>
        <article className="rounded-2xl border border-rose-100 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm text-rose-600">Alertas</p>
          <p className="text-3xl font-semibold text-rose-600">{summary.metasEnAlerta}</p>
          <p className="text-xs text-rose-500 mt-2">Metas pausadas o canceladas detectadas por el sistema.</p>
        </article>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">{error}</div>
      )}

      {showForm && (
        <section className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                {formMode === "create" ? "Nueva meta" : "Editar meta"}
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {formMode === "create" ? "Registrar meta de ahorro" : "Actualizar meta de ahorro"}
              </h2>
            </div>
            <button onClick={() => setShowForm(false)} className="text-sm text-slate-500 hover:text-slate-900">
              Cerrar
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                required
              />
              <Select
                label="Estado"
                value={formData.estado}
                onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.value as MetaAhorroEstado }))}
                options={estadoOptions}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                rows={3}
                placeholder="Describe la meta"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Monto objetivo"
                type="number"
                min="0"
                step="0.01"
                value={formData.monto_objetivo}
                onChange={(e) => setFormData((prev) => ({ ...prev, monto_objetivo: e.target.value }))}
                required
              />
              <Input
                label="Monto acumulado"
                type="number"
                min="0"
                step="0.01"
                value={formData.monto_acumulado}
                onChange={(e) => setFormData((prev) => ({ ...prev, monto_acumulado: e.target.value }))}
              />
              <Select
                label="Prioridad"
                value={formData.prioridad}
                onChange={(e) => setFormData((prev) => ({ ...prev, prioridad: e.target.value }))}
                options={prioridadOptions}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Fecha objetivo"
                type="date"
                value={formData.fecha_objetivo}
                onChange={(e) => setFormData((prev) => ({ ...prev, fecha_objetivo: e.target.value }))}
                required
              />
              <Input
                label="Fecha inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData((prev) => ({ ...prev, fecha_inicio: e.target.value }))}
                required
              />
              <Input
                label="Fecha completada"
                type="date"
                value={formData.fecha_completada}
                onChange={(e) => setFormData((prev) => ({ ...prev, fecha_completada: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Promedio ahorro mensual"
                type="number"
                min="0"
                step="0.01"
                value={formData.promedio_ahorro_mensual}
                onChange={(e) => setFormData((prev) => ({ ...prev, promedio_ahorro_mensual: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-slate-800 transition disabled:bg-slate-400"
              >
                {isSubmitting ? "Guardando..." : formMode === "create" ? "Guardar" : "Actualizar"}
              </Button>
              <p className="text-sm text-slate-500">Todos los campos alimentan reportes y seguimiento mensual.</p>
            </div>
          </form>
        </section>
      )}

      <section className="space-y-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Metas priorizadas</p>
          <h2 className="text-3xl font-semibold text-slate-900">Control detallado por meta</h2>
          <p className="text-slate-500 text-sm">
            Incluye nombre de la meta, monto objetivo, acumulado, porcentaje de avance, fecha objetivo, días restantes,
            estado y el aporte mensual requerido para cumplirla según el calendario definido.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {!metas.length && !loading && (
            <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              Aún no tienes metas registradas. Usa el botón "Registrar meta" para comenzar.
            </div>
          )}
          {metas.map((meta) => {
            const progress = getProgress(meta);
            const daysRemaining = getDaysRemaining(meta.fecha_objetivo);
            const remaining = Math.max(0, (meta.monto_objetivo ?? 0) - (meta.monto_acumulado ?? 0));
            const aporteNecesario = meta.fecha_objetivo
              ? remaining / Math.max(1, Math.ceil(getDaysRemaining(meta.fecha_objetivo) / 30))
              : 0;

            return (
              <article
                key={meta.id}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-200/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {prioridadLabels[String(meta.prioridad) as keyof typeof prioridadLabels] || "Sin prioridad"}
                      {" "}prioridad
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900 mt-1">{meta.nombre}</h3>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estadoConfig[meta.estado].color}`}>
                    {estadoConfig[meta.estado].label}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-3">{meta.descripcion || "Sin descripción"}</p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Acumulado</span>
                    <span>
                      {currencyFormatter.format(meta.monto_acumulado ?? 0)} / {currencyFormatter.format(meta.monto_objetivo ?? 0)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{progress}% logrado</span>
                    <span>{daysRemaining} días restantes</span>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <dt className="text-slate-500">Fecha objetivo</dt>
                    <dd className="text-slate-900 font-semibold">
                      {meta.fecha_objetivo
                        ? new Date(meta.fecha_objetivo).toLocaleDateString("es-HN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "No definida"}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <dt className="text-slate-500">Aporte requerido</dt>
                    <dd className="text-slate-900 font-semibold">
                      {currencyFormatter.format(Math.max(0, Math.ceil(aporteNecesario)))} / mes
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
                  Ritmo actual: {currencyFormatter.format(meta.promedio_ahorro_mensual ?? 0)}/mes •
                  <span className={`ml-1 ${estadoConfig[meta.estado].badge}`}>
                    {meta.estado === "cancelado"
                      ? "Cancelada"
                      : meta.estado === "pausado"
                      ? "Pausada temporalmente"
                      : meta.estado === "completado"
                      ? "Meta alcanzada"
                      : "En ejecución"}
                  </span>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleOpenForm("edit", meta)}
                    className="text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(meta)}
                    className="text-sm font-semibold text-rose-600 border border-rose-200 rounded-xl px-4 py-2 hover:bg-rose-50"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 mb-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Calendario de cumplimiento</p>
          <h3 className="text-2xl font-semibold text-slate-900">Seguimiento mensual</h3>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-slate-500">
                <th className="py-3 pr-4">Meta</th>
                <th className="py-3 pr-4">Objetivo</th>
                <th className="py-3 pr-4">Acumulado</th>
                <th className="py-3 pr-4">% logrado</th>
                <th className="py-3 pr-4">Fecha objetivo</th>
                <th className="py-3 pr-4">Días restantes</th>
                <th className="py-3 pr-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {metas.map((meta) => {
                const progress = getProgress(meta);
                const daysRemaining = getDaysRemaining(meta.fecha_objetivo);
                return (
                  <tr key={meta.id} className="border-t border-slate-100">
                    <td className="py-4 pr-4 font-semibold text-slate-900">{meta.nombre}</td>
                    <td className="py-4 pr-4 text-slate-600">{currencyFormatter.format(meta.monto_objetivo ?? 0)}</td>
                    <td className="py-4 pr-4 text-slate-600">{currencyFormatter.format(meta.monto_acumulado ?? 0)}</td>
                    <td className="py-4 pr-4 text-slate-900">{progress}%</td>
                    <td className="py-4 pr-4 text-slate-600">
                      {meta.fecha_objetivo
                        ? new Date(meta.fecha_objetivo).toLocaleDateString("es-HN", { month: "short", year: "numeric" })
                        : "No definida"}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{daysRemaining}</td>
                    <td className="py-4 pr-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estadoConfig[meta.estado].color}`}>
                        {estadoConfig[meta.estado].label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
