-- SP_INSERTAR_META_AHORRO
-- Inserta un nuevo registro en la tabla META_AHORRO y retorna el id generado.
RECREATE PROCEDURE SP_INSERTAR_META_AHORRO (
    p_id_usuario INTEGER,
    p_nombre VARCHAR(255),
    p_descripcion VARCHAR(500),
    p_monto_objetivo NUMERIC(15,2),
    p_monto_acumulado NUMERIC(15,2),
    p_fecha_objetivo DATE,
    p_estado INTEGER,
    p_prioridad INTEGER,
    p_promedio_ahorro_mensual NUMERIC(15,2),
    p_fecha_inicio DATE,
    p_fecha_completada DATE,
    p_creado_por INTEGER
)
RETURNS (
    id_meta_ahorro INTEGER
)
AS
BEGIN
    INSERT INTO META_AHORRO (
        id_usuario,
        nombre,
        descripcion,
        monto_objetivo,
        monto_acumulado,
        fecha_objetivo,
        estado,
        prioridad,
        promedio_ahorro_mensual,
        fecha_inicio,
        fecha_completada,
        creado_en,
        creado_por
    )
    VALUES (
        :p_id_usuario,
        :p_nombre,
        :p_descripcion,
        :p_monto_objetivo,
        :p_monto_acumulado,
        :p_fecha_objetivo,
        :p_estado,
        :p_prioridad,
        :p_promedio_ahorro_mensual,
        :p_fecha_inicio,
        :p_fecha_completada,
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id INTO id_meta_ahorro;
    SUSPEND;
END
