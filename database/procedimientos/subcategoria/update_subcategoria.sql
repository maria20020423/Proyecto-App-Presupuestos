-- SP_ACTUALIZAR_SUBCATEGORIA
-- Actualiza un registro existente en la tabla SUBCATEGORIA.
CREATE PROCEDURE SP_ACTUALIZAR_SUBCATEGORIA (
    p_id_subcategoria INTEGER,
    p_categoria_id INTEGER,
    p_nombre VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_is_default BOOLEAN,
    p_modificado_por INTEGER
)
AS
BEGIN
    UPDATE SUBCATEGORIA
    SET categoria_id = :p_categoria_id,
        nombre = :p_nombre,
        descripcion = :p_descripcion,
        is_default = :p_is_default,
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id = :p_id_subcategoria;
END#
