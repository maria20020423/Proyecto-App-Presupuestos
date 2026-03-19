-- SP_ELIMINAR_TRANSACCIONES
-- Realiza un soft delete actualizando el campo estado a 'inactivo' en la tabla TRANSACCIONES.
CREATE PROCEDURE SP_ELIMINAR_TRANSACCIONES (
    p_id_transacciones INTEGER,
    p_modificado_por INTEGER
)
AS
BEGIN
    UPDATE TRANSACCIONES
    SET estado = 'inactivo',
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id = :p_id_transacciones;
END#
