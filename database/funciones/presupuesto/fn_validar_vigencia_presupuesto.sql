CREATE FUNCTION FN_VALIDAR_VIGENCIA_PRESUPUESTO (
    p_anio INTEGER,
    p_mes INTEGER,
    p_id_presupuesto INTEGER
)
RETURNS SMALLINT
AS
DECLARE VARIABLE v_anio_inicio INTEGER;
DECLARE VARIABLE v_mes_inicio INTEGER;
DECLARE VARIABLE v_anio_fin INTEGER;
DECLARE VARIABLE v_mes_fin INTEGER;
DECLARE VARIABLE v_clave_objetivo INTEGER;
DECLARE VARIABLE v_clave_inicio INTEGER;
DECLARE VARIABLE v_clave_fin INTEGER;
BEGIN
    IF (p_anio IS NULL OR p_mes IS NULL OR p_id_presupuesto IS NULL) THEN
        RETURN 0;

    SELECT anio_inicio, mes_inicio, anio_fin, mes_fin
    FROM PRESUPUESTO
    WHERE id_presupuesto = :p_id_presupuesto
    INTO :v_anio_inicio, :v_mes_inicio, :v_anio_fin, :v_mes_fin;

    IF (v_anio_inicio IS NULL) THEN
        RETURN 0;

    v_clave_inicio = v_anio_inicio * 100 + v_mes_inicio;
    v_clave_fin = v_anio_fin * 100 + v_mes_fin;
    v_clave_objetivo = :p_anio * 100 + :p_mes;

    IF (v_clave_objetivo < v_clave_inicio OR v_clave_objetivo > v_clave_fin) THEN
        RETURN 0;

    RETURN 1;
END#
