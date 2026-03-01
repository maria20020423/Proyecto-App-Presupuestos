-- SP_ACTUALIZAR_OBLIGACION_FIJA
-- Actualiza un registro existente en la tabla OBLIGACION_FIJA.
RECREATE PROCEDURE SP_ACTUALIZAR_OBLIGACION_FIJA (
    p_id_obligacion_fija INTEGER,
    p_id_usuario INTEGER,
    p_subcategoria_id INTEGER,
    p_nombre VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_dia_mes_expiracion INTEGER,
    p_is_vigente BOOLEAN,
    p_fecha_inicio DATE,
    p_fecha_final DATE,
    p_modificado_por INTEGER
)
AS
BEGIN
    UPDATE OBLIGACION_FIJA
    SET id_usuario = :p_id_usuario,
        subcategoria_id = :p_subcategoria_id,
        nombre = :p_nombre,
        descripcion = :p_descripcion,
        dia_mes_expiracion = :p_dia_mes_expiracion,
        is_vigente = :p_is_vigente,
        fecha_inicio = :p_fecha_inicio,
        fecha_final = :p_fecha_final,
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id = :p_id_obligacion_fija;
END
