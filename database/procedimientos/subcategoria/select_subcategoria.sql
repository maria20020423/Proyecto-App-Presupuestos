-- SP_CONSULTAR_SUBCATEGORIA
-- Devuelve un único registro de la tabla SUBCATEGORIA según su id.
RECREATE PROCEDURE SP_CONSULTAR_SUBCATEGORIA (
    p_id_subcategoria INTEGER
)
RETURNS (
    id INTEGER,
    categoria_id INTEGER,
    nombre VARCHAR(500),
    descripcion VARCHAR(500),
    is_default BOOLEAN,
    creado_en TIMESTAMP,
    modificado_en TIMESTAMP,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    SELECT 
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
    WHERE id = :p_id_subcategoria
    INTO 
        :id,
        :categoria_id,
        :nombre,
        :descripcion,
        :is_default,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por;
    IF (id IS NOT NULL) THEN
        SUSPEND;
END
