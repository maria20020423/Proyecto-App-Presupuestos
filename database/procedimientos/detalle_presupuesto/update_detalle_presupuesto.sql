-- SP_ACTUALIZAR_DETALLE_PRESUPUESTO
-- Actualiza un registro existente en la tabla DETALLE_PRESUPUESTO.
RECREATE PROCEDURE SP_ACTUALIZAR_DETALLE_PRESUPUESTO (
    p_id_detalle_presupuesto INTEGER,
    p_presupuesto_id INTEGER,
    p_subcategoria_id INTEGER,
    p_observaciones VARCHAR(500),
    p_monto_mensual NUMERIC(15,2),
    p_creado_por INTEGER
)
AS
BEGIN
    UPDATE DETALLE_PRESUPUESTO
    SET presupuesto_id = :p_presupuesto_id,
        subcategoria_id = :p_subcategoria_id,
        observaciones = :p_observaciones,
        monto_mensual = :p_monto_mensual,
        creado_por = :p_creado_por,
        modificado_en = CURRENT_TIMESTAMP
    WHERE id = :p_id_detalle_presupuesto;
END
