-- SP_ACTUALIZAR_META_AHORRO
-- Actualiza un registro existente en la tabla META_AHORRO.
RECREATE PROCEDURE SP_ACTUALIZAR_META_AHORRO (
    p_id_meta_ahorro INTEGER,
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
    p_modificado_por INTEGER
)
AS
BEGIN
    UPDATE META_AHORRO
    SET id_usuario = :p_id_usuario,
        nombre = :p_nombre,
        descripcion = :p_descripcion,
        monto_objetivo = :p_monto_objetivo,
        monto_acumulado = :p_monto_acumulado,
        fecha_objetivo = :p_fecha_objetivo,
        estado = :p_estado,
        prioridad = :p_prioridad,
        promedio_ahorro_mensual = :p_promedio_ahorro_mensual,
        fecha_inicio = :p_fecha_inicio,
        fecha_completada = :p_fecha_completada,
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id = :p_id_meta_ahorro;
END
