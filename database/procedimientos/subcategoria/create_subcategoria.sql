-- SP_INSERTAR_SUBCATEGORIA
-- Inserta un nuevo registro en la tabla SUBCATEGORIA y retorna el id generado.
CREATE PROCEDURE SP_INSERTAR_SUBCATEGORIA (
    p_categoria_id INTEGER,
    p_nombre VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_is_default BOOLEAN,
    p_creado_por INTEGER
)
RETURNS (
    id_subcategoria INTEGER
)
AS
BEGIN
    INSERT INTO SUBCATEGORIA (
        categoria_id,
        nombre,
        descripcion,
        is_default,
        creado_en,
        creado_por
    )
    VALUES (
        :p_categoria_id,
        :p_nombre,
        :p_descripcion,
        :p_is_default,
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id INTO id_subcategoria;
    SUSPEND;
END#
