
RECREATE PROCEDURE SP_LISTAR_DETALLE_PRESUPUESTO
RETURNS (
    id INTEGER,
    presupuesto_id INTEGER,
    subcategoria_id INTEGER,
    observaciones VARCHAR(500),
    monto_mensual NUMERIC(15,2),
    modificado_en TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE,
    creado_por INTEGER
)
AS
BEGIN
    FOR SELECT 
        id,
        presupuesto_id,
        subcategoria_id,
        observaciones,
        monto_mensual,
        modificado_en,
        creado_en,
        creado_por
    FROM DETALLE_PRESUPUESTO
    INTO 
        :id,
        :presupuesto_id,
        :subcategoria_id,
        :observaciones,
        :monto_mensual,
        :modificado_en,
        :creado_en,
        :creado_por
    DO
        SUSPEND;
END
