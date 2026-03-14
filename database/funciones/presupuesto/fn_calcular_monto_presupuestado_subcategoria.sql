CREATE FUNCTION FN_CALCULAR_MONTO_PRESUPUESTADO_SUBCATEGORIA (
    p_id_presupuesto INTEGER,
    p_id_subcategoria INTEGER
)
RETURNS NUMERIC(15, 2)
AS
DECLARE VARIABLE v_monto NUMERIC(15, 2);
BEGIN
    SELECT monto_mensual
    FROM DETALLE_PRESUPUESTO
    WHERE presupuesto_id = :p_id_presupuesto
      AND subcategoria_id = :p_id_subcategoria
      AND estado = 'activo'
    INTO :v_monto;

    RETURN COALESCE(v_monto, 0);
END#
