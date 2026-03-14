export interface UpdateSubcategoriaDto {
    nombre?: string;
    descripcion?: string;
    estado?: 'activa' | 'inactiva';
    modificado_por: number;
}
