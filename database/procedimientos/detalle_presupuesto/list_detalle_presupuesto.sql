
CREATE PROCEDURE SP_LISTAR_DETALLE_PRESUPUESTO (p_id_presupuesto INTEGER)

RETURNS (
    id INTEGER,
    presupuesto_id INTEGER,
    subcategoria_id INTEGER,
    observaciones VARCHAR(500),
    monto_mensual NUMERIC(15,2),
    modificado_en TIMESTAMP,
    creado_en TIMESTAMP,
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
    WHERE presupuesto_id=p_id_presupuesto
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
END#
