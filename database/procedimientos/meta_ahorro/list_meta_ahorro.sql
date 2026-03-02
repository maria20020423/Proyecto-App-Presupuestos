-- SP_LISTAR_META_AHORRO
-- Devuelve todos los registros de la tabla META_AHORRO.
RECREATE PROCEDURE SP_LISTAR_META_AHORRO
RETURNS (
    id INTEGER,
    id_usuario INTEGER,
    nombre VARCHAR(255),
    descripcion VARCHAR(500),
    monto_objetivo NUMERIC(15,2),
    monto_acumulado NUMERIC(15,2),
    fecha_objetivo DATE,
    estado INTEGER,
    prioridad INTEGER,
    promedio_ahorro_mensual NUMERIC(15,2),
    fecha_inicio DATE,
    fecha_completada DATE,
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
        modificado_en,
        creado_por,
        modificado_por
    FROM META_AHORRO
    INTO 
        :id,
        :id_usuario,
        :nombre,
        :descripcion,
        :monto_objetivo,
        :monto_acumulado,
        :fecha_objetivo,
        :estado,
        :prioridad,
        :promedio_ahorro_mensual,
        :fecha_inicio,
        :fecha_completada,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por
    DO
        SUSPEND;
END
