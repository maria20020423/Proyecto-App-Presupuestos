CREATE FUNCTION FN_CALCULAR_PROYECCION_GASTO_MENSUAL (
    p_id_subcategoria INTEGER,
    p_id_presupuesto INTEGER,
    p_anio INTEGER,
    p_mes INTEGER
)
RETURNS NUMERIC(15, 2)
AS
DECLARE VARIABLE v_monto_ejecutado NUMERIC(15, 2);
DECLARE VARIABLE v_dia_actual INTEGER;
DECLARE VARIABLE v_dias_mes INTEGER;
DECLARE VARIABLE v_proyeccion NUMERIC(15, 2);

BEGIN

    IF (FN_VALIDAR_VIGENCIA_PRESUPUESTO(:p_anio, :p_mes, :p_id_presupuesto) = 0) THEN
        RETURN 0;

    v_monto_ejecutado = FN_CALCULAR_MONTO_EJECUTADO(:p_id_subcategoria, :p_id_presupuesto, :p_anio, :p_mes);
    v_dia_actual = EXTRACT(DAY FROM CURRENT_DATE);
    v_dias_mes = LAST_DAY(OF MONTH FROM CURRENT_DATE);

    IF (v_dia_actual <= 0 OR v_dias_mes <= 0) THEN
        RETURN v_monto_ejecutado;

    v_proyeccion = (v_monto_ejecutado / v_dia_actual) * v_dias_mes;
    RETURN COALESCE(v_proyeccion, v_monto_ejecutado);
END#
