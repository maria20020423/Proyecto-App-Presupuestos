-- SP_ELIMINAR_TRANSACCIONES
-- Realiza un soft delete actualizando el campo estado a 'inactivo' en la tabla TRANSACCIONES.
RECREATE PROCEDURE SP_ELIMINAR_TRANSACCIONES (
    p_id_transacciones INTEGER
)
AS
BEGIN
    UPDATE TRANSACCIONES
    SET estado = 'inactivo',
        modificado_en = CURRENT_TIMESTAMP
    WHERE id = :p_id_transacciones;
END
