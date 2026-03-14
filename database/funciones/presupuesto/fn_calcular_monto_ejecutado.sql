CREATE FUNCTION FN_CALCULAR_MONTO_EJECUTADO (
    p_id_subcategoria INTEGER,
    p_id_presupuesto INTEGER,
    p_anio INTEGER,
    p_mes INTEGER
)
RETURNS NUMERIC(15, 2)
AS
DECLARE VARIABLE v_total NUMERIC(15, 2);
BEGIN
    SELECT COALESCE(SUM(monto), 0)
    FROM TRANSACCIONES
    WHERE subcategoria_id = :p_id_subcategoria
      AND presupuesto_id = :p_id_presupuesto
      AND anio = :p_anio
      AND mes = :p_mes
    INTO :v_total;

    RETURN COALESCE(v_total, 0);
END#
