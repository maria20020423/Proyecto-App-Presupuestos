
CREATE PROCEDURE SP_LISTAR_DETALLE_PRESUPUESTO (
    p_id_presupuesto INTEGER
)
RETURNS (
    id INTEGER,
    presupuesto_id INTEGER,
    subcategoria_id INTEGER,
    monto_mensual NUMERIC(15, 2),
    observaciones VARCHAR(500),
    estado VARCHAR(20),
    creado_en TIMESTAMP,
    modificado_en TIMESTAMP,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    FOR SELECT 
        id,
        presupuesto_id,
        subcategoria_id,
        monto_mensual,
        observaciones,
        estado,
        creado_en,
        modificado_en,
        creado_por,
        modificado_por
    FROM DETALLE_PRESUPUESTO
    WHERE presupuesto_id = :p_id_presupuesto
    INTO 
        :id,
        :presupuesto_id,
        :subcategoria_id,
        :monto_mensual,
        :observaciones,
        :estado,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por
    DO
        SUSPEND;
END#
