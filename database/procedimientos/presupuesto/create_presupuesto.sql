CREATE PROCEDURE SP_INSERTAR_PRESUPUESTO (
    id_usuario INTEGER,
    nombre_presupuesto VARCHAR(255),
    anio_inicio INTEGER,
    mes_inicio INTEGER,
    anio_fin INTEGER,
    mes_fin INTEGER,
    total_ingresos_planificados NUMERIC(15, 2),
    total_gastos_planificados NUMERIC(15, 2),
    total_ahorro_planificado NUMERIC(15, 2),
    fecha_creacion TIMESTAMP,
    estado VARCHAR(20),
    creado_en TIMESTAMP,
    creado_por INTEGER
) RETURNS (nuevo_id_presupuesto INTEGER) AS
DECLARE VARIABLE v_overlap INTEGER;

BEGIN 
SELECT COUNT(*)
FROM PRESUPUESTO
WHERE id_usuario = :id_usuario
    AND estado = 'activo'

    AND (anio_inicio * 100 + mes_inicio) <= (:anio_fin * 100 + :mes_fin)
    AND (anio_fin * 100 + mes_fin) >= (:anio_inicio * 100 + :mes_inicio) INTO :v_overlap;

IF (:v_overlap > 0) THEN EXCEPTION EX_PRESUPUESTO_TRASLAPADO;

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
    )
VALUES (
        :id_usuario,
        :nombre_presupuesto,
        :anio_inicio,
        :mes_inicio,
        :anio_fin,
        :mes_fin,
        :total_ingresos_planificados,
        :total_gastos_planificados,
        :total_ahorro_planificado,
        :fecha_creacion,
        :estado,
        :creado_en,
        :creado_por
    )
RETURNING id_presupuesto INTO nuevo_id_presupuesto;
SUSPEND;
END #