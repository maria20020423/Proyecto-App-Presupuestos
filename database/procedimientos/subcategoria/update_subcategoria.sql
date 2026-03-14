-- SP_ACTUALIZAR_SUBCATEGORIA
-- Actualiza un registro existente en la tabla SUBCATEGORIA.
CREATE PROCEDURE SP_ACTUALIZAR_SUBCATEGORIA (
    p_id_subcategoria INTEGER,
    p_nombre VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_estado VARCHAR(20),
    p_modificado_por INTEGER
)
AS
DECLARE VARIABLE v_is_default BOOLEAN;
BEGIN
    SELECT is_default FROM SUBCATEGORIA WHERE id = :p_id_subcategoria INTO :v_is_default;
    IF (v_is_default IS NULL) THEN
        EXCEPTION ex_subcategoria_no_encontrada;

    UPDATE SUBCATEGORIA
    SET nombre = COALESCE(:p_nombre, nombre),
        descripcion = COALESCE(:p_descripcion, descripcion),
        estado = CASE WHEN :p_estado IS NULL THEN estado ELSE :p_estado END,
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id = :p_id_subcategoria;
END#
