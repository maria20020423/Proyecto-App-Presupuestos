"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { categoriaService, subcategoriaService, authStorage } from "@/services/apiClient";
import { detallePresupuestoService } from "@/services/detalle-presupuesto.service";
import type { Categoria, Subcategoria, CreateDetallePresupuestoDto } from "@/types/api";

interface DetallePresupuestoFormProps {
  presupuestoId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  subcategoria_id: string;
  monto_mensual: string;
  observaciones: string;
}

export function DetallePresupuestoForm({ presupuestoId, onSuccess, onCancel }: DetallePresupuestoFormProps) {
  const [formData, setFormData] = useState<FormData>({
    subcategoria_id: "",
    monto_mensual: "",
    observaciones: "",
  });
  
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
    
    // Reset subcategoria when category changes
    if (field === 'subcategoria_id') {
      setFormData(prev => ({
        ...prev,
        subcategoria_id: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subcategoria_id || !formData.monto_mensual) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    const userId = authStorage.getUserId();
    if (!userId) {
      setError("Debes iniciar sesión para crear un detalle de presupuesto");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createData: CreateDetallePresupuestoDto = {
        presupuesto_id: presupuestoId,
        subcategoria_id: Number(formData.subcategoria_id),
        monto_mensual: Number(formData.monto_mensual),
        observaciones: formData.observaciones,
        creado_por: userId
      };

      await detallePresupuestoService.create(createData);

      // Reset form
      setFormData({
        subcategoria_id: "",
        monto_mensual: "",
        observaciones: "",
      });
      setSelectedCategoria("");

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando detalle de presupuesto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Nuevo</p>
          <h2 className="text-2xl font-semibold text-slate-900">Agregar Detalle de Presupuesto</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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
          </div>
          
          <div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Monto mensual"
            type="number"
            value={formData.monto_mensual}
            onChange={(e) => handleInputChange("monto_mensual", e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
          
          <Input
            label="Observaciones"
            type="text"
            value={formData.observaciones}
            onChange={(e) => handleInputChange("observaciones", e.target.value)}
            placeholder="Notas sobre este presupuesto"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-slate-800 transition disabled:bg-slate-400"
          >
            {loading ? "Guardando..." : "Agregar Detalle"}
          </Button>
          <p className="text-sm text-slate-500">
            Este detalle se agregará al presupuesto actual
          </p>
        </div>
      </form>
    </div>
  );
}
