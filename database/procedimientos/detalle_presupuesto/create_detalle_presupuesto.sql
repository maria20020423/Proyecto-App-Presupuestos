CREATE PROCEDURE SP_INSERTAR_DETALLE_PRESUPUESTO (
    p_id_presupuesto INTEGER,
    p_id_subcategoria INTEGER,
    p_monto_mensual NUMERIC(15, 2),
    p_observaciones VARCHAR(500),
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
        monto_mensual,
        observaciones,
        estado,
        creado_en,
        creado_por
    )
    VALUES (
        :p_id_presupuesto,
        :p_id_subcategoria,
        :p_monto_mensual,
        :p_observaciones,
        'activo',
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id INTO id_detalle_presupuesto;

    SUSPEND;
END#
