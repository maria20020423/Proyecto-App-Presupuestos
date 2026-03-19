
CREATE PROCEDURE SP_ELIMINAR_DETALLE_PRESUPUESTO (
    p_id_detalle_presupuesto INTEGER,
    p_modificado_por INTEGER
)
AS
BEGIN
    UPDATE DETALLE_PRESUPUESTO
    SET estado = 'inactivo',
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id = :p_id_detalle_presupuesto;
END#
