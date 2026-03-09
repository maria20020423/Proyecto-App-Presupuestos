CREATE PROCEDURE SP_ELIMINAR_OBLIGACION_FIJA (
    p_id_obligacion_fija INTEGER
)
AS
BEGIN
    UPDATE OBLIGACION_FIJA
    SET estado = 'inactivo',
        modificado_en = CURRENT_TIMESTAMP
    WHERE id = :p_id_obligacion_fija;
END#
