CREATE FUNCTION FN_OBTENER_PROMEDIO_GASTO_SUBCATEGORIA (
    p_id_usuario INTEGER,
    p_id_subcategoria INTEGER,
    p_cantidad_meses INTEGER
)
RETURNS NUMERIC(15, 2)
AS
DECLARE VARIABLE v_total NUMERIC(15, 2);
DECLARE VARIABLE v_promedio NUMERIC(15, 2);
BEGIN
    IF (p_cantidad_meses <= 0) THEN
        RETURN 0;

    SELECT COALESCE(SUM(monto), 0)
    FROM TRANSACCIONES
    WHERE id_usuario = :p_id_usuario
      AND subcategoria_id = :p_id_subcategoria
      AND estado = 'activo'
      AND (anio * 100 + mes) >= ((EXTRACT(YEAR FROM CURRENT_DATE) * 100 + EXTRACT(MONTH FROM CURRENT_DATE)) - :p_cantidad_meses)
    INTO :v_total;

    v_promedio = v_total / :p_cantidad_meses;
    RETURN COALESCE(v_promedio, 0);
END#
