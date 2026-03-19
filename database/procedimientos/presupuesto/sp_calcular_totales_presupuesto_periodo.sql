CREATE PROCEDURE SP_CALCULAR_TOTALES_PRESUPUESTO_PERIODO (
    p_id_usuario INTEGER,
    p_id_presupuesto INTEGER,
    p_anio_inicio INTEGER,
    p_mes_inicio INTEGER,
    p_anio_fin INTEGER,
    p_mes_fin INTEGER
)
RETURNS (
    anio INTEGER,
    mes INTEGER,
    mes_nombre VARCHAR(20),
    total_ingresos NUMERIC(15, 2),
    total_gastos NUMERIC(15, 2),
    total_ahorros NUMERIC(15, 2),
    balance_final NUMERIC(15, 2)
)
AS
DECLARE VARIABLE v_presupuesto_usuario INTEGER;
DECLARE VARIABLE v_estado VARCHAR(20);
DECLARE VARIABLE v_current_anio INTEGER;
DECLARE VARIABLE v_current_mes INTEGER;
DECLARE VARIABLE v_clave_actual INTEGER;
DECLARE VARIABLE v_clave_fin INTEGER;
DECLARE VARIABLE v_total_ing NUMERIC(15, 2);
DECLARE VARIABLE v_total_gas NUMERIC(15, 2);
DECLARE VARIABLE v_total_aho NUMERIC(15, 2);
BEGIN

    SELECT id_usuario, estado
    FROM PRESUPUESTO
    WHERE id_presupuesto = :p_id_presupuesto
    INTO :v_presupuesto_usuario, :v_estado;

    IF (v_presupuesto_usuario IS NULL) THEN
        EXCEPTION ex_presupuesto_no_encontrado;

    IF (v_presupuesto_usuario <> p_id_usuario) THEN
        EXCEPTION ex_presupuesto_usuario;

    v_current_anio = :p_anio_inicio;
    v_current_mes = :p_mes_inicio;
    v_clave_fin = :p_anio_fin * 100 + :p_mes_fin;

    WHILE (v_current_anio * 100 + v_current_mes <= v_clave_fin) DO
    BEGIN

        SELECT
            COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END), 0),
            COALESCE(SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END), 0),
            COALESCE(SUM(CASE WHEN tipo = 'ahorro' THEN monto ELSE 0 END), 0)
        FROM TRANSACCIONES
        WHERE id_usuario = :p_id_usuario
          AND presupuesto_id = :p_id_presupuesto
          AND anio = :v_current_anio
          AND mes = :v_current_mes
          AND estado = 'activo'
        INTO :v_total_ing, :v_total_gas, :v_total_aho;

        -- Asignar valores a los campos de retorno
        anio = :v_current_anio;
        mes = :v_current_mes;
        total_ingresos = :v_total_ing;
        total_gastos = :v_total_gas;
        total_ahorros = :v_total_aho;
        balance_final = :v_total_ing - :v_total_gas - :v_total_aho;

        -- Asignar nombre del mes
        IF (v_current_mes = 1) THEN mes_nombre = 'Enero';
        ELSE IF (v_current_mes = 2) THEN mes_nombre = 'Febrero';
        ELSE IF (v_current_mes = 3) THEN mes_nombre = 'Marzo';
        ELSE IF (v_current_mes = 4) THEN mes_nombre = 'Abril';
        ELSE IF (v_current_mes = 5) THEN mes_nombre = 'Mayo';
        ELSE IF (v_current_mes = 6) THEN mes_nombre = 'Junio';
        ELSE IF (v_current_mes = 7) THEN mes_nombre = 'Julio';
        ELSE IF (v_current_mes = 8) THEN mes_nombre = 'Agosto';
        ELSE IF (v_current_mes = 9) THEN mes_nombre = 'Septiembre';
        ELSE IF (v_current_mes = 10) THEN mes_nombre = 'Octubre';
        ELSE IF (v_current_mes = 11) THEN mes_nombre = 'Noviembre';
        ELSE mes_nombre = 'Diciembre';

        SUSPEND;

        -- Avanzar al siguiente mes
        IF (v_current_mes = 12) THEN
        BEGIN
            v_current_anio = v_current_anio + 1;
            v_current_mes = 1;
        END
        ELSE
            v_current_mes = v_current_mes + 1;
    END
END#
