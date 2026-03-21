CREATE FUNCTION FN_OBTENER_TOTAL_CATEGORIA_MES (
    p_id_categoria INTEGER,
    p_id_presupuesto INTEGER,
    p_anio INTEGER,
    p_mes INTEGER
)
RETURNS NUMERIC(15, 2)
AS
DECLARE VARIABLE v_total NUMERIC(15, 2);
BEGIN

    IF (FN_VALIDAR_VIGENCIA_PRESUPUESTO(:p_anio, :p_mes, :p_id_presupuesto) = 0) THEN
        RETURN 0;
 
    SELECT COALESCE(SUM(dp.monto_mensual), 0)
    FROM DETALLE_PRESUPUESTO dp
    INNER JOIN SUBCATEGORIA s ON s.id = dp.subcategoria_id
    WHERE dp.presupuesto_id = :p_id_presupuesto
      AND s.categoria_id = :p_id_categoria
    INTO :v_total;

    RETURN COALESCE(v_total, 0);
END#
