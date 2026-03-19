"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable, TableColumnDef, ActionColumnConfig } from "@/components/ui/Table";
import { Label } from "@/components/ui/Label";
import { categoriaService, authStorage } from "@/services/apiClient";
import { Categoria, CreateCategoriaDto } from "@/types/api";

const CATEGORY_TYPES = [
  { value: "ingreso", label: "Ingreso" },
  { value: "gasto", label: "Gasto" },
];

export default function CategoriasPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateCategoriaDto>({
    nombre: "",
    descripcion: "",
    tipo_categoria: "gasto",
    category_icon: "",
    color_format: "#3b82f6",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const userId = authStorage.getUserId();
    if (userId) {
      loadCategorias(userId);
    }
  }, []);

  const loadCategorias = async (userId: number) => {
    try {
      setLoading(true);
      const response = await categoriaService.getAll(userId);
      if (response.results) {
        setCategorias(response.results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando categorías");
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
      await categoriaService.create(userId, formData);
      setShowForm(false);
      setFormData({
        nombre: "",
        descripcion: "",
        tipo_categoria: "gasto",
        category_icon: "",
        color_format: "#3b82f6",
      });
      await loadCategorias(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando categoría");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoria: Categoria) => {
    if (!confirm(`¿Eliminar categoría "${categoria.nombre}"?`)) return;
    
    try {
      await categoriaService.delete(categoria.id);
      const userId = authStorage.getUserId();
      if (userId) await loadCategorias(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando categoría");
    }
  };

  const handleViewSubcategorias = (categoria: Categoria) => {
    router.push(`/dashboard/categorias/${categoria.id}/subcategorias`);
  };

  const columns: TableColumnDef<Categoria>[] = [
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
      id: "tipo_categoria",
      header: "Tipo",
      accessorKey: "tipo_categoria",
      cell: ({ row }) => {
        const tipo = CATEGORY_TYPES.find(t => t.value === row.original.tipo_categoria);
        return (
          <Label variant={row.original.tipo_categoria === "ingreso" ? "success" : "danger"}>
            {tipo?.label || row.original.tipo_categoria}
          </Label>
        );
      },
    },
    {
      id: "color",
      header: "Color",
      cell: ({ row }) => (
        <div
          className="w-6 h-6 rounded"
          style={{ backgroundColor: row.original.color_format }}
        />
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

  const actionConfig: ActionColumnConfig<Categoria> = {
    onDelete: handleDelete,
    customActions: [
      {
        label: "Ver Subcategorías",
        onClick: handleViewSubcategorias,
        variant: "outline",
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancelar" : "Nueva Categoría"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Crear Nueva Categoría</h2>
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
                  Tipo de Categoría
                </label>
                <select
                  value={formData.tipo_categoria}
                  onChange={(e) => setFormData({ ...formData, tipo_categoria: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color_format}
                  onChange={(e) => setFormData({ ...formData, color_format: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
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
        data={categorias}
        columns={columns}
        actionConfig={actionConfig}
        getRowId={(row) => row.id}
        isLoading={loading}
        emptyMessage="No hay categorías registradas"
      />
    </div>
  );
}