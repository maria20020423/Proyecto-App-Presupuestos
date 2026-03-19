CREATE PROCEDURE SP_OBTENER_RESUMEN_CATEGORIA_MES (
    p_id_categoria INTEGER,
    p_id_presupuesto INTEGER,
    p_anio INTEGER,
    p_mes INTEGER
)
RETURNS (
    monto_presupuestado NUMERIC(15, 2),
    monto_ejecutado NUMERIC(15, 2),
    porcentaje NUMERIC(9, 4)
)
AS
DECLARE VARIABLE v_presupuestado NUMERIC(15, 2);
DECLARE VARIABLE v_ejecutado NUMERIC(15, 2);
BEGIN
    v_presupuestado = FN_OBTENER_TOTAL_CATEGORIA_MES(:p_id_categoria, :p_id_presupuesto, :p_anio, :p_mes);
    v_ejecutado = FN_OBTENER_TOTAL_EJECUTADO_CATEGORIA_MES(:p_id_categoria, :p_id_presupuesto, :p_anio, :p_mes);

    monto_presupuestado = v_presupuestado;
    monto_ejecutado = v_ejecutado;

    IF (v_presupuestado = 0) THEN
        porcentaje = 0;
    ELSE
        porcentaje = (v_ejecutado / v_presupuestado) * 100;

    SUSPEND;
END#
