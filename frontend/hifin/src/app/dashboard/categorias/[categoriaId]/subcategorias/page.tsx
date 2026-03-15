"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DataTable, TableColumnDef, ActionColumnConfig } from "@/components/ui/Table";
import { Label } from "@/components/ui/Label";
import { subcategoriaService, authStorage, categoriaService } from "@/services/apiClient";
import { Subcategoria, CreateSubcategoriaDto, Categoria } from "@/types/api";

export default function SubcategoriasPage() {
  const params = useParams();
  const router = useRouter();
  const categoriaId = parseInt(params.categoriaId as string);
  
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateSubcategoriaDto>({
    nombre: "",
    descripcion: "",
    is_default: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [categoriaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catResponse, subResponse] = await Promise.all([
        categoriaService.getById(categoriaId),
        subcategoriaService.getByCategoria(categoriaId),
      ]);
      
      if (catResponse.results && catResponse.results.length > 0) {
        setCategoria(catResponse.results[0]);
      }
      if (subResponse.results) {
        setSubcategorias(subResponse.results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = authStorage.getUserId();
    if (!userId) return;

    setSubmitting(true);
    try {
      await subcategoriaService.create(userId, formData, categoriaId);
      setShowForm(false);
      setFormData({
        nombre: "",
        descripcion: "",
        is_default: false,
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando subcategoría");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (subcategoria: Subcategoria) => {
    if (!confirm(`¿Eliminar subcategoría "${subcategoria.nombre}"?`)) return;
    
    try {
      await subcategoriaService.delete(subcategoria.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando subcategoría");
    }
  };

  const columns: TableColumnDef<Subcategoria>[] = [
    {
      id: "nombre",
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      id: "descripcion",
      header: "Descripción",
      accessorKey: "descripcion",
    },
    {
      id: "is_default",
      header: "Por Defecto",
      accessorKey: "is_default",
      cell: ({ row }) => (
        <Label variant={row.original.is_default ? "info" : "default"}>
          {row.original.is_default ? "Sí" : "No"}
        </Label>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      accessorKey: "estado",
      cell: ({ row }) => (
        <Label variant={row.original.estado === "activa" ? "success" : "warning"}>
          {row.original.estado}
        </Label>
      ),
    },
  ];

  const actionConfig: ActionColumnConfig<Subcategoria> = {
    onDelete: handleDelete,
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard/categorias")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Subcategorías {categoria ? `- ${categoria.nombre}` : ""}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancelar" : "Nueva Subcategoría"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Crear Nueva Subcategoría</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Es por defecto?
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_default" className="text-sm text-gray-600">
                    Marque si es la subcategoría predeterminada
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </form>
        </div>
      )}

      <DataTable
        data={subcategorias}
        columns={columns}
        actionConfig={actionConfig}
        getRowId={(row) => row.id}
        isLoading={loading}
        emptyMessage="No hay subcategorías registradas"
      />
    </div>
  );
}