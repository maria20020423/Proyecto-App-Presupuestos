CREATE PROCEDURE SP_CREAR_PRESUPUESTO_COMPLETO (
    p_id_usuario INTEGER,
    p_nombre VARCHAR(255),
    p_descripcion VARCHAR(500),
    p_anio_inicio INTEGER,
    p_mes_inicio INTEGER,
    p_anio_fin INTEGER,
    p_mes_fin INTEGER,
    p_total_ingresos NUMERIC(15,2),
    p_total_gastos NUMERIC(15,2),
    p_total_ahorro NUMERIC(15,2),
    p_creado_por INTEGER
)
RETURNS (
    id_presupuesto INTEGER
)
AS
DECLARE VARIABLE v_estado VARCHAR(20);
DECLARE VARIABLE v_fecha_creacion TIMESTAMP;
DECLARE VARIABLE v_overlap INTEGER;
BEGIN
    v_estado = 'activo';
    v_fecha_creacion = CURRENT_TIMESTAMP;

    IF (p_anio_fin < p_anio_inicio) THEN
        EXCEPTION ex_presupuesto_vigencia;

    IF (p_anio_fin = p_anio_inicio AND p_mes_fin < p_mes_inicio) THEN
        EXCEPTION ex_presupuesto_vigencia;

    SELECT COUNT(1)
    FROM PRESUPUESTO
    WHERE id_usuario = :p_id_usuario
      AND estado = 'activo'
      AND ((anio_inicio * 100 + mes_inicio) <= (p_anio_fin * 100 + p_mes_fin))
      AND ((anio_fin * 100 + mes_fin) >= (p_anio_inicio * 100 + p_mes_inicio))
    INTO :v_overlap;

    IF (v_overlap > 0) THEN
        EXCEPTION ex_presupuesto_traslapado;

    INSERT INTO PRESUPUESTO (
        id_usuario,
        nombre_presupuesto,
        anio_inicio,
        mes_inicio,
        anio_fin,
        mes_fin,
        total_ingresos_planificados,
        total_gastos_planificados,
        total_ahorro_planificado,
        fecha_creacion,
        estado,
        creado_en,
        creado_por
    ) VALUES (
        :p_id_usuario,
        :p_nombre,
        :p_anio_inicio,
        :p_mes_inicio,
        :p_anio_fin,
        :p_mes_fin,
        :p_total_ingresos,
        :p_total_gastos,
        :p_total_ahorro,
        :v_fecha_creacion,
        :v_estado,
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id_presupuesto INTO :id_presupuesto;

    SUSPEND;
END#
