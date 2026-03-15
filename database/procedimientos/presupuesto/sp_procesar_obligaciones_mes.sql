CREATE PROCEDURE SP_PROCESAR_OBLIGACIONES_MES (
    p_id_usuario INTEGER,
    p_anio INTEGER,
    p_mes INTEGER,
    p_id_presupuesto INTEGER
)
RETURNS (
    id_obligacion INTEGER,
    nombre_obligacion VARCHAR(500),
    subcategoria_id INTEGER,
    dia_vencimiento INTEGER,
    dias_restantes INTEGER,
    alerta VARCHAR(50)
)
AS
DECLARE VARIABLE v_presupuesto_usuario INTEGER;
DECLARE VARIABLE v_estado VARCHAR(20);
DECLARE VARIABLE v_clave_inicio INTEGER;
DECLARE VARIABLE v_clave_fin INTEGER;
DECLARE VARIABLE v_clave_mes INTEGER;
DECLARE VARIABLE v_anio_inicio INTEGER;
DECLARE VARIABLE v_mes_inicio INTEGER;
DECLARE VARIABLE v_anio_fin INTEGER;
DECLARE VARIABLE v_mes_fin INTEGER;
DECLARE VARIABLE v_fecha_objetivo DATE;
DECLARE VARIABLE v_dias_restantes INTEGER;
BEGIN
    SELECT id_usuario, estado, anio_inicio, mes_inicio, anio_fin, mes_fin
    FROM PRESUPUESTO
    WHERE id_presupuesto = :p_id_presupuesto
    INTO :v_presupuesto_usuario, :v_estado, :v_anio_inicio, :v_mes_inicio, :v_anio_fin, :v_mes_fin;

    IF (v_presupuesto_usuario IS NULL) THEN
        EXCEPTION ex_presupuesto_no_encontrado;

    IF (v_presupuesto_usuario <> p_id_usuario) THEN
        EXCEPTION ex_presupuesto_usuario;

    IF (v_estado <> 'activo') THEN
        EXCEPTION ex_presupuesto_estado;

    v_clave_mes = :p_anio * 100 + :p_mes;
    v_clave_inicio = v_anio_inicio * 100 + v_mes_inicio;
    v_clave_fin = v_anio_fin * 100 + v_mes_fin;

    IF (v_clave_mes < v_clave_inicio OR v_clave_mes > v_clave_fin) THEN
        EXCEPTION ex_presupuesto_fuera_vigencia;

    FOR SELECT
            o.id,
            o.nombre,
            o.subcategoria_id,
            o.dia_mes_expiracion,
            fn_dias_hasta_vencimiento(o.id)
        FROM OBLIGACION_FIJA o
        WHERE o.id_usuario = :p_id_usuario
          AND o.is_vigente = TRUE
          AND :p_anio BETWEEN EXTRACT(YEAR FROM o.fecha_inicio) AND EXTRACT(YEAR FROM COALESCE(o.fecha_final, DATE '9999-12-31'))
    INTO
        :id_obligacion,
        :nombre_obligacion,
        :subcategoria_id,
        :dia_vencimiento,
        :dias_restantes
    DO
    BEGIN
        IF (:dias_restantes IS NULL) THEN
            alerta = 'fuera_vigencia';
        ELSE IF (:dias_restantes < 0) THEN
            alerta = 'vencida';
        ELSE IF (:dias_restantes = 0) THEN
            alerta = 'vence_hoy';
        ELSE IF (:dias_restantes <= 3) THEN
            alerta = 'por_vencer';
        ELSE
            alerta = 'programada';

        SUSPEND;
    END
END#
