CREATE PROCEDURE SP_LISTAR_SUBCATEGORIAS_POR_CATEGORIA (
    p_categoria_id INTEGER
)
RETURNS (
    id INTEGER,
    categoria_id INTEGER,
    nombre VARCHAR(500),
    descripcion VARCHAR(500),
    is_default BOOLEAN,
    estado VARCHAR(20),
    creado_en TIMESTAMP,
    modificado_en TIMESTAMP,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    FOR SELECT 
        id,
        categoria_id,
        nombre,
        descripcion,
        is_default,
        estado,
        creado_en,
        modificado_en,
        creado_por,
        modificado_por
    FROM SUBCATEGORIA
    WHERE categoria_id = :p_categoria_id
    ORDER BY is_default DESC, nombre
    INTO 
        :id,
        :categoria_id,
        :nombre,
        :descripcion,
        :is_default,
        :estado,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por
    DO
        SUSPEND;
END#
