-- SP_ELIMINAR_META_AHORRO
-- Realiza un soft delete actualizando el campo estado a 'inactivo' en la tabla META_AHORRO.
RECREATE PROCEDURE SP_ELIMINAR_META_AHORRO (
    p_id_meta_ahorro INTEGER
)
AS
BEGIN
    UPDATE META_AHORRO
    SET estado = 'inactivo',
        modificado_en = CURRENT_TIMESTAMP
    WHERE id = :p_id_meta_ahorro;
END#
