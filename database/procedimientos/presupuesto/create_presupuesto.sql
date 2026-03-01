CREATE OR ALTER PROCEDURE SP_INSERTAR_PRESUPUESTO (
    id_usuario INTEGER,
    nombre_presupuesto VARCHAR(255),
    anio_inicio INTEGER,
    mes_inicio INTEGER,
    anio_fin INTEGER,
    mes_fin INTEGER,
    total_ingresos_planificados NUMERIC(15,2),
    total_gastos_planificados NUMERIC(15,2),
    total_ahorro_planificado NUMERIC(15,2),
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20),
    creado_en TIMESTAMP WITH TIME ZONE,
    creado_por INTEGER
)
AS
BEGIN
    INSERT INTO PRESUPUESTO (
        id_usuario, nombre_presupuesto, anio_inicio, mes_inicio, anio_fin, mes_fin,
        total_ingresos_planificados, total_gastos_planificados, total_ahorro_planificado,
        fecha_creacion, estado, creado_en, creado_por
    )
    VALUES (
        :id_usuario, :nombre_presupuesto, :anio_inicio, :mes_inicio, :anio_fin, :mes_fin,
        :total_ingresos_planificados, :total_gastos_planificados, :total_ahorro_planificado,
        :fecha_creacion, :estado, :creado_en, :creado_por
    );
END
