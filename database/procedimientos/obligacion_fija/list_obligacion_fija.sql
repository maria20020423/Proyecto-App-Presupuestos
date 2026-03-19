CREATE PROCEDURE SP_LISTAR_OBLIGACION_FIJA (
    p_id_usuario INTEGER,
    p_is_vigente BOOLEAN
)
RETURNS (
    id INTEGER,
    id_usuario INTEGER,
    subcategoria_id INTEGER,
    nombre VARCHAR(500),
    descripcion VARCHAR(500),
    dia_mes_expiracion INTEGER,
    monto NUMERIC(15,2),
    is_vigente BOOLEAN,
    fecha_inicio DATE,
    fecha_final DATE,
    creado_en TIMESTAMP,
    modificado_en TIMESTAMP,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    FOR SELECT 
        id,
        id_usuario,
        subcategoria_id,
        nombre,
        descripcion,
        dia_mes_expiracion,
        monto,
        is_vigente,
        fecha_inicio,
        fecha_final,
        creado_en,
        modificado_en,
        creado_por,
        modificado_por
    FROM OBLIGACION_FIJA
    WHERE id_usuario = COALESCE(:p_id_usuario, id_usuario)
      AND is_vigente = COALESCE(:p_is_vigente, is_vigente)
    INTO 
        :id,
        :id_usuario,
        :subcategoria_id,
        :nombre,
        :descripcion,
        :dia_mes_expiracion,
        :monto,
        :is_vigente,
        :fecha_inicio,
        :fecha_final,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por
    DO
        SUSPEND;
END#
