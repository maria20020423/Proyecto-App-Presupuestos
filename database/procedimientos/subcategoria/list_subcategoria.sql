-- SP_LISTAR_SUBCATEGORIA
-- Devuelve todos los registros de la tabla SUBCATEGORIA.
RECREATE PROCEDURE SP_LISTAR_SUBCATEGORIA
RETURNS (
    id INTEGER,
    categoria_id INTEGER,
    nombre VARCHAR(500),
    descripcion VARCHAR(500),
    is_default BOOLEAN,
    creado_en TIMESTAMP WITH TIME ZONE,
    modificado_en TIMESTAMP WITH TIME ZONE,
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
        creado_en,
        modificado_en,
        creado_por,
        modificado_por
    FROM SUBCATEGORIA
    INTO 
        :id,
        :categoria_id,
        :nombre,
        :descripcion,
        :is_default,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por
    DO
        SUSPEND;
END
