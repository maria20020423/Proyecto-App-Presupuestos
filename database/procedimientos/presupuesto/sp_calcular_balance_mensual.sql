CREATE PROCEDURE SP_CALCULAR_BALANCE_MENSUAL (
    p_id_usuario INTEGER,
    p_id_presupuesto INTEGER,
    p_anio INTEGER,
    p_mes INTEGER
)
RETURNS (
    total_ingresos NUMERIC(15, 2),
    total_gastos NUMERIC(15, 2),
    total_ahorros NUMERIC(15, 2),
    balance_final NUMERIC(15, 2)
)
AS
DECLARE VARIABLE v_presupuesto_usuario INTEGER;
DECLARE VARIABLE v_estado VARCHAR(20);
BEGIN
    IF (FN_VALIDAR_VIGENCIA_PRESUPUESTO(:p_anio, :p_mes, :p_id_presupuesto) = 0) THEN
        EXCEPTION ex_presupuesto_fuera_vigencia;

    SELECT id_usuario, estado
    FROM PRESUPUESTO
    WHERE id_presupuesto = :p_id_presupuesto
    INTO :v_presupuesto_usuario, :v_estado;

    IF (v_presupuesto_usuario IS NULL OR v_estado <> 'activo') THEN
        EXCEPTION ex_presupuesto_no_encontrado;


    SELECT
        COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN tipo = 'ahorro' THEN monto ELSE 0 END), 0)
    FROM TRANSACCIONES
    WHERE id_usuario = :p_id_usuario
      AND presupuesto_id = :p_id_presupuesto
      AND anio = :p_anio
      AND mes = :p_mes
      AND estado = 'activo'
    INTO :total_ingresos, :total_gastos, :total_ahorros;

    balance_final = total_ingresos - total_gastos - total_ahorros;

    SUSPEND;
END#
