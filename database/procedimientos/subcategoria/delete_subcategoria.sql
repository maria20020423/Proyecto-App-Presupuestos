-- SP_ELIMINAR_SUBCATEGORIA
-- Realiza un soft delete actualizando el campo estado a 'inactivo' en la tabla SUBCATEGORIA.
CREATE PROCEDURE SP_ELIMINAR_SUBCATEGORIA (
    p_id_subcategoria INTEGER
)
AS
BEGIN
    UPDATE SUBCATEGORIA
    SET estado = 'inactivo',
        modificado_en = CURRENT_TIMESTAMP
    WHERE id = :p_id_subcategoria;
END#
