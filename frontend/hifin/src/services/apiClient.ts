import { LoginDTO, LoginResponseDTO, CreateCategoriaDto, CreateCategoriaResponseDTO, UpdateCategoriaDto, CategoriaListResponse, CreateSubcategoriaDto, CreateSubcategoriaResponseDTO, SubcategoriaListResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de red" }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}

export const authService = {
  async login(credentials: LoginDTO): Promise<LoginResponseDTO> {
    return fetchApi<LoginResponseDTO>("/usuarios/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};

export const categoriaService = {
  async getAll(id_usuario: number, tipo_categoria?: number): Promise<CategoriaListResponse> {
    const params = new URLSearchParams({ id_usuario: id_usuario.toString() });
    if (tipo_categoria !== undefined) {
      params.append("tipo_categoria", tipo_categoria.toString());
    }
    return fetchApi<CategoriaListResponse>(`/categorias?${params.toString()}`);
  },

  async getById(id_categoria: number): Promise<CategoriaListResponse> {
    return fetchApi<CategoriaListResponse>(`/categorias/${id_categoria}`);
  },

  async create(id_usuario: number, categoria: CreateCategoriaDto): Promise<CreateCategoriaResponseDTO> {
    return fetchApi<CreateCategoriaResponseDTO>("/categorias", {
      method: "POST",
      body: JSON.stringify({ ...categoria, id_usuario }),
    });
  },

  async update(id_categoria: number, categoria: UpdateCategoriaDto): Promise<{ message: string }> {
    return fetchApi<{ message: string }>(`/categorias/${id_categoria}`, {
      method: "PUT",
      body: JSON.stringify(categoria),
    });
  },

  async delete(id_categoria: number): Promise<{ message: string }> {
    return fetchApi<{ message: string }>(`/categorias/${id_categoria}`, {
      method: "DELETE",
    });
  },
};

export const subcategoriaService = {
  async getByCategoria(id_categoria: number): Promise<SubcategoriaListResponse> {
    return fetchApi<SubcategoriaListResponse>(`/subcategorias/categoria/${id_categoria}`);
  },

  async create(id_usuario: number, subcategoria: CreateSubcategoriaDto, categoriaId: number): Promise<CreateSubcategoriaResponseDTO> {
    return fetchApi<CreateSubcategoriaResponseDTO>("/subcategorias", {
      method: "POST",
      body: JSON.stringify({ ...subcategoria, categoria_id: categoriaId, creado_por: id_usuario }),
    });
  },

  async delete(id_subcategoria: number): Promise<{ message: string }> {
    return fetchApi<{ message: string }>(`/subcategorias/${id_subcategoria}`, {
      method: "DELETE",
    });
  },
};

export const storageKeys = {
  USER_ID: "hifin_user_id",
  USER_DATA: "hifin_user_data",
} as const;

export const authStorage = {
  setUserId(id: number): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKeys.USER_ID, id.toString());
      document.cookie = `hifin_user_id=${id}; path=/; max-age=86400`;
    }
  },

  getUserId(): number | null {
    if (typeof window === "undefined") return null;
    const id = localStorage.getItem(storageKeys.USER_ID);
    return id ? parseInt(id, 10) : null;
  },

  setUserData(data: LoginResponseDTO["usuario"]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKeys.USER_DATA, JSON.stringify(data));
    }
  },

  getUserData(): LoginResponseDTO["usuario"] | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(storageKeys.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKeys.USER_ID);
      localStorage.removeItem(storageKeys.USER_DATA);
      document.cookie = "hifin_user_id=; path=/; max-age=0";
    }
  },

  isAuthenticated(): boolean {
    return this.getUserId() !== null;
  },
};