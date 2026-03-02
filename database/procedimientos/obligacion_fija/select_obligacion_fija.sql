
RECREATE PROCEDURE SP_CONSULTAR_OBLIGACION_FIJA (
    p_id_obligacion_fija INTEGER
)
RETURNS (
    id INTEGER,
    id_usuario INTEGER,
    subcategoria_id INTEGER,
    nombre VARCHAR(500),
    descripcion VARCHAR(500),
    dia_mes_expiracion INTEGER,
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
    SELECT 
        id,
        id_usuario,
        subcategoria_id,
        nombre,
        descripcion,
        dia_mes_expiracion,
        is_vigente,
        fecha_inicio,
        fecha_final,
        creado_en,
        modificado_en,
        creado_por,
        modificado_por
    FROM OBLIGACION_FIJA
    WHERE id = :p_id_obligacion_fija
    INTO 
        :id,
        :id_usuario,
        :subcategoria_id,
        :nombre,
        :descripcion,
        :dia_mes_expiracion,
        :is_vigente,
        :fecha_inicio,
        :fecha_final,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por;
    IF (id IS NOT NULL) THEN
        SUSPEND;
END
