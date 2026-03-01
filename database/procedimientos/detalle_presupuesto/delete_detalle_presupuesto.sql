
RECREATE PROCEDURE SP_ELIMINAR_DETALLE_PRESUPUESTO (
    p_id_detalle_presupuesto INTEGER
)
AS
BEGIN
    UPDATE DETALLE_PRESUPUESTO
    SET estado = 'inactivo',
        modificado_en = CURRENT_TIMESTAMP
    WHERE id = :p_id_detalle_presupuesto;
END
