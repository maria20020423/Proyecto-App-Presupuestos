
CREATE PROCEDURE SP_ACTUALIZAR_DETALLE_PRESUPUESTO (
    p_id_detalle_presupuesto INTEGER,
    p_monto_mensual NUMERIC(15, 2),
    p_observaciones VARCHAR(500),
    p_modificado_por INTEGER
)
AS
BEGIN
    UPDATE DETALLE_PRESUPUESTO
    SET monto_mensual = :p_monto_mensual,
        observaciones = :p_observaciones,
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id = :p_id_detalle_presupuesto;
END#
