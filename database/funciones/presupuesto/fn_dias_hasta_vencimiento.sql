CREATE FUNCTION FN_DIAS_HASTA_VENCIMIENTO (
    p_id_obligacion INTEGER
)
RETURNS INTEGER
AS
DECLARE VARIABLE v_dia INTEGER;
DECLARE VARIABLE v_fecha_inicio DATE;
DECLARE VARIABLE v_fecha_fin DATE;
DECLARE VARIABLE v_fecha_objetivo DATE;
DECLARE VARIABLE v_mes INTEGER;
DECLARE VARIABLE v_anio INTEGER;
BEGIN
    SELECT dia_mes_expiracion, fecha_inicio, COALESCE(fecha_final, DATE '9999-12-31')
    FROM OBLIGACION_FIJA
    WHERE id = :p_id_obligacion
    INTO :v_dia, :v_fecha_inicio, :v_fecha_fin;

    IF (v_dia IS NULL) THEN
        RETURN NULL;

    v_mes = EXTRACT(MONTH FROM CURRENT_DATE);
    v_anio = EXTRACT(YEAR FROM CURRENT_DATE);
    v_fecha_objetivo = DATEFROMPARTS(:v_anio, :v_mes, :v_dia);

    IF (v_fecha_objetivo < CURRENT_DATE) THEN
    BEGIN
        IF (v_mes = 12) THEN
        BEGIN
            v_mes = 1;
            v_anio = v_anio + 1;
        END
        ELSE
            v_mes = v_mes + 1;

        v_fecha_objetivo = DATEFROMPARTS(:v_anio, :v_mes, :v_dia);
    END

    IF (v_fecha_objetivo < v_fecha_inicio OR v_fecha_objetivo > v_fecha_fin) THEN
        RETURN NULL;

    RETURN DATEDIFF(DAY, CURRENT_DATE, v_fecha_objetivo);
END#
