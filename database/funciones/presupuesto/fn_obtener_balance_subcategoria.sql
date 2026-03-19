CREATE FUNCTION FN_OBTENER_BALANCE_SUBCATEGORIA (
    p_id_presupuesto INTEGER,
    p_id_subcategoria INTEGER,
    p_anio INTEGER,
    p_mes INTEGER
)
RETURNS NUMERIC(15, 2)
AS
DECLARE VARIABLE v_monto_presupuestado NUMERIC(15, 2);
DECLARE VARIABLE v_monto_ejecutado NUMERIC(15, 2);
BEGIN
    v_monto_presupuestado = FN_CALCULAR_MONTO_PRESUPUESTADO_SUBCATEGORIA(:p_id_presupuesto, :p_id_subcategoria);
    v_monto_ejecutado = FN_CALCULAR_MONTO_EJECUTADO(:p_id_subcategoria, :p_id_presupuesto, :p_anio, :p_mes);

    RETURN v_monto_presupuestado - v_monto_ejecutado;
END#
