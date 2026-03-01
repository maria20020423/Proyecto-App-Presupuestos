export interface Usuario {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo_electronico: string;
    creado_en: string;
    modificado_en?: string;
    creador_por?: number;
    modificado_por?: number;
    salario_mensual_base: number;
    estado: 'activo' | 'inactivo';
}
