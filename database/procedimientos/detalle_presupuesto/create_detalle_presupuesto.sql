--
CREATE PROCEDURE SP_INSERTAR_DETALLE_PRESUPUESTO (
    p_presupuesto_id INTEGER,
    p_subcategoria_id INTEGER,
    p_observaciones VARCHAR(500),
    p_monto_mensual NUMERIC(15,2),
    p_creado_por INTEGER
)
RETURNS (
    id_detalle_presupuesto INTEGER
)
AS
BEGIN
    INSERT INTO DETALLE_PRESUPUESTO (
        presupuesto_id,
        subcategoria_id,
        observaciones,
        monto_mensual,
        creado_en,
        creado_por
    )
    VALUES (
        :p_presupuesto_id,
        :p_subcategoria_id,
        :p_observaciones,
        :p_monto_mensual,
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id INTO id_detalle_presupuesto;
    SUSPEND;
END#
