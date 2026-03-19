CREATE PROCEDURE SP_CERRAR_PRESUPUESTO (
    p_id_presupuesto INTEGER,
    p_modificado_por INTEGER
)
RETURNS (
    total_ingresos NUMERIC(15, 2),
    total_gastos NUMERIC(15, 2),
    total_ahorros NUMERIC(15, 2),
    balance_final NUMERIC(15, 2)
)
AS
DECLARE VARIABLE v_estado VARCHAR(20);
DECLARE VARIABLE v_anio_fin INTEGER;
DECLARE VARIABLE v_mes_fin INTEGER;
DECLARE VARIABLE v_anio_actual INTEGER;
DECLARE VARIABLE v_mes_actual INTEGER;
DECLARE VARIABLE v_id_usuario INTEGER;
DECLARE VARIABLE v_monto_ingresos NUMERIC(15, 2);
DECLARE VARIABLE v_monto_gastos NUMERIC(15, 2);
DECLARE VARIABLE v_monto_ahorros NUMERIC(15, 2);
BEGIN
    SELECT estado, anio_fin, mes_fin, id_usuario
    FROM PRESUPUESTO
    WHERE id_presupuesto = :p_id_presupuesto
    INTO :v_estado, :v_anio_fin, :v_mes_fin, :v_id_usuario;

    IF (v_estado IS NULL) THEN
        EXCEPTION ex_presupuesto_no_encontrado;

    IF (v_estado = 'cerrado') THEN
        EXCEPTION ex_presupuesto_estado;

    v_anio_actual = EXTRACT(YEAR FROM CURRENT_DATE);
    v_mes_actual = EXTRACT(MONTH FROM CURRENT_DATE);

    IF ((v_anio_actual * 100 + v_mes_actual) < (v_anio_fin * 100 + v_mes_fin)) THEN
        EXCEPTION ex_presupuesto_no_finalizado;

    SELECT
        COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN tipo = 'ahorro' THEN monto ELSE 0 END), 0)
    FROM TRANSACCIONES
    WHERE presupuesto_id = :p_id_presupuesto
      AND estado = 'activo'
    INTO :v_monto_ingresos, :v_monto_gastos, :v_monto_ahorros;

    UPDATE PRESUPUESTO
    SET estado = 'cerrado',
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id_presupuesto = :p_id_presupuesto;

    total_ingresos = v_monto_ingresos;
    total_gastos = v_monto_gastos;
    total_ahorros = v_monto_ahorros;
    balance_final = v_monto_ingresos - v_monto_gastos - v_monto_ahorros;

    SUSPEND;
END#
