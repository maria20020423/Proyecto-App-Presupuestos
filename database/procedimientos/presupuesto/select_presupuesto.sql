CREATE OR ALTER PROCEDURE SP_CONSULTAR_PRESUPUESTO (
    id_presupuesto INTEGER
)
RETURNS (
    id_presupuesto INTEGER,
    id_usuario INTEGER,
    nombre_presupuesto VARCHAR(255),
    anio_inicio INTEGER,
    mes_inicio INTEGER,
    anio_fin INTEGER,
    mes_fin INTEGER,
    total_ingresos_planificados NUMERIC(15,2),
    total_gastos_planificados NUMERIC(15,2),
    total_ahorro_planificado NUMERIC(15,2),
    fecha_creacion TIMESTAMP,
    estado VARCHAR(20),
    creado_en TIMESTAMP,
    modificado_en TIMESTAMP,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    FOR SELECT 
        id_presupuesto, id_usuario, nombre_presupuesto, anio_inicio, mes_inicio, anio_fin, mes_fin,
        total_ingresos_planificados, total_gastos_planificados, total_ahorro_planificado,
        fecha_creacion, estado, creado_en, modificado_en, creado_por, modificado_por
    FROM PRESUPUESTO
    WHERE id_presupuesto = :id_presupuesto
    INTO 
        :id_presupuesto, :id_usuario, :nombre_presupuesto, :anio_inicio, :mes_inicio, :anio_fin, :mes_fin,
        :total_ingresos_planificados, :total_gastos_planificados, :total_ahorro_planificado,
        :fecha_creacion, :estado, :creado_en, :modificado_en, :creado_por, :modificado_por
    DO
    BEGIN
        SUSPEND;
    END
END#
