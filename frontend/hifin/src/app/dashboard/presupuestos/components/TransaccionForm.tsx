"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { categoriaService, subcategoriaService, authStorage } from "@/services/apiClient";
import { transaccionesService } from "@/services/transacciones.service";
import type { Categoria, Subcategoria, CreateTransaccionDto } from "@/types/api";

interface TransaccionFormProps {
  presupuestoId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  anio: string;
  mes: string;
  subcategoria_id: string;
  tipo: string;
  descripcion: string;
  monto: string;
  fecha: string;
  metodo_pago: string;
  no_factura: string;
  observaciones: string;
}

const INITIAL_FORM: FormData = {
  anio: new Date().getFullYear().toString(),
  mes: (new Date().getMonth() + 1).toString(),
  subcategoria_id: "",
  tipo: "gasto",
  descripcion: "",
  monto: "",
  fecha: new Date().toISOString().split("T")[0],
  metodo_pago: "",
  no_factura: "",
  observaciones: "",
};

const meses = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const tiposTransaccion = [
  { value: "ingreso", label: "Ingreso" },
  { value: "gasto", label: "Gasto" },
];

const metodosPago = [
  { value: "", label: "Seleccionar..." },
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta de Débito", label: "Tarjeta de Débito" },
  { value: "Tarjeta de Crédito", label: "Tarjeta de Crédito" },
  { value: "Transferencia", label: "Transferencia" },
  { value: "Cheque", label: "Cheque" },
];

export function TransaccionForm({ presupuestoId, onSuccess, onCancel }: TransaccionFormProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  // Load categories
  useEffect(() => {
    const loadCategorias = async () => {
      const userId = authStorage.getUserId();
      if (!userId) return;
      
      try {
        setLoadingCategorias(true);
        const response = await categoriaService.getAll(userId);
        setCategorias(response.results ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando categorías");
      } finally {
        setLoadingCategorias(false);
      }
    };

    loadCategorias();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (!selectedCategoria) {
      setSubcategorias([]);
      return;
    }

    const loadSubcategorias = async () => {
      try {
        const response = await subcategoriaService.getByCategoria(Number(selectedCategoria));
        setSubcategorias(response.results ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando subcategorías");
      }
    };

    loadSubcategorias();
  }, [selectedCategoria]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subcategoria_id || !formData.monto || !formData.descripcion) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    const userId = authStorage.getUserId();
    if (!userId) {
      setError("Debes iniciar sesión para registrar una transacción");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createData: CreateTransaccionDto = {
        id_usuario: userId,
        presupuesto_id: presupuestoId,
        anio: Number(formData.anio),
        mes: Number(formData.mes),
        subcategoria_id: Number(formData.subcategoria_id),
        obligacion_id: undefined,
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        monto: Number(formData.monto),
        fecha: formData.fecha,
        metodo_pago: formData.metodo_pago || undefined,
        no_factura: formData.no_factura || undefined,
        observaciones: formData.observaciones || undefined,
        creado_por: userId,
      };

      await transaccionesService.create(userId, createData);

      // Reset form
      setFormData(INITIAL_FORM);
      setSelectedCategoria("");

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error registrando transacción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Nueva</p>
          <h2 className="text-2xl font-semibold text-slate-900">Registrar Transacción</h2>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Cancelar
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Periodo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Año"
            type="number"
            value={formData.anio}
            onChange={(e) => handleInputChange("anio", e.target.value)}
            min="2000"
            max="2100"
            required
          />
          <Select
            label="Mes"
            value={formData.mes}
            onChange={(e) => handleInputChange("mes", e.target.value)}
            options={meses.map(m => ({ value: m.value, label: m.label }))}
            required
          />
        </div>

        {/* Categoría y Subcategoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Categoría"
            value={selectedCategoria}
            onChange={(e) => {
              setSelectedCategoria(e.target.value);
              setFormData(prev => ({ ...prev, subcategoria_id: "" }));
            }}
            options={categorias.map(cat => ({
              value: cat.id,
              label: cat.nombre,
            }))}
            disabled={loadingCategorias}
            required
          />
          
          <Select
            label="Subcategoría"
            value={formData.subcategoria_id}
            onChange={(e) => handleInputChange("subcategoria_id", e.target.value)}
            options={subcategorias.map(sub => ({
              value: sub.id,
              label: sub.nombre,
            }))}
            disabled={!selectedCategoria || subcategorias.length === 0}
            required
          />
        </div>

        {/* Tipo y Monto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tipo de Transacción"
            value={formData.tipo}
            onChange={(e) => handleInputChange("tipo", e.target.value)}
            options={tiposTransaccion}
            required
          />
          
          <Input
            label="Monto"
            type="number"
            value={formData.monto}
            onChange={(e) => handleInputChange("monto", e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Descripción y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Descripción"
            type="text"
            value={formData.descripcion}
            onChange={(e) => handleInputChange("descripcion", e.target.value)}
            placeholder="Ej. Compra de víveres"
            required
          />
          
          <Input
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => handleInputChange("fecha", e.target.value)}
            required
          />
        </div>

        {/* Método de Pago y No. Factura */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Método de Pago"
            value={formData.metodo_pago}
            onChange={(e) => handleInputChange("metodo_pago", e.target.value)}
            options={metodosPago}
          />
          
          <Input
            label="No. Factura"
            type="text"
            value={formData.no_factura}
            onChange={(e) => handleInputChange("no_factura", e.target.value)}
            placeholder="Ej. FAC-001-2024"
          />
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Observaciones
          </label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => handleInputChange("observaciones", e.target.value)}
            placeholder="Notas adicionales sobre esta transacción"
            rows={3}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-slate-800 transition disabled:bg-slate-400"
          >
            {loading ? "Guardando..." : "Registrar Transacción"}
          </Button>
          <p className="text-sm text-slate-500">
            Esta transacción se asociará al presupuesto actual
          </p>
        </div>
      </form>
    </div>
  );
}
