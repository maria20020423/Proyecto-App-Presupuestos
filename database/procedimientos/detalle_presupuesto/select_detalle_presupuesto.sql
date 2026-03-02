
RECREATE PROCEDURE SP_CONSULTAR_DETALLE_PRESUPUESTO (
    p_id_detalle_presupuesto INTEGER
)
RETURNS (
    id INTEGER,
    presupuesto_id INTEGER,
    subcategoria_id INTEGER,
    observaciones VARCHAR(500),
    monto_mensual NUMERIC(15,2),
    modificado_en TIMESTAMP,
    creado_en TIMESTAMP,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    SELECT 
        id,
        presupuesto_id,
        subcategoria_id,
        observaciones,
        monto_mensual,
        modificado_en,
        creado_en,
        creado_por,
        modificado_por
    FROM DETALLE_PRESUPUESTO
    WHERE id = :p_id_detalle_presupuesto
    INTO 
        :id,
        :presupuesto_id,
        :subcategoria_id,
        :observaciones,
        :monto_mensual,
        :modificado_en,
        :creado_en,
        :creado_por,
        :modificado_por;

    IF (id IS NOT NULL) THEN
        SUSPEND;
END
