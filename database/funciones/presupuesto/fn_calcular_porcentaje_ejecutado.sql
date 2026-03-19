CREATE FUNCTION FN_CALCULAR_PORCENTAJE_EJECUTADO (
    p_id_subcategoria INTEGER,
    p_id_presupuesto INTEGER,
    p_anio INTEGER,
    p_mes INTEGER
)
RETURNS NUMERIC(9, 4)
AS
DECLARE VARIABLE v_monto_ejecutado NUMERIC(15, 2);
DECLARE VARIABLE v_monto_presupuestado NUMERIC(15, 2);
DECLARE VARIABLE v_porcentaje NUMERIC(9, 4);
BEGIN
    v_monto_ejecutado = FN_CALCULAR_MONTO_EJECUTADO(:p_id_subcategoria, :p_id_presupuesto, :p_anio, :p_mes);
    v_monto_presupuestado = FN_CALCULAR_MONTO_PRESUPUESTADO_SUBCATEGORIA(:p_id_presupuesto, :p_id_subcategoria);

    IF (v_monto_presupuestado = 0) THEN
        RETURN 0;

    v_porcentaje = (v_monto_ejecutado / v_monto_presupuestado) * 100;
    RETURN v_porcentaje;
END#
