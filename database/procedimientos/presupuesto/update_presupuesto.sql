RECREATE  PROCEDURE SP_ACTUALIZAR_PRESUPUESTO (
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
    estado VARCHAR(20),
    modificado_en TIMESTAMP,
    modificado_por INTEGER
)
AS
BEGIN
    UPDATE PRESUPUESTO
    SET 
        id_usuario = :id_usuario,
        nombre_presupuesto = :nombre_presupuesto,
        anio_inicio = :anio_inicio,
        mes_inicio = :mes_inicio,
        anio_fin = :anio_fin,
        mes_fin = :mes_fin,
        total_ingresos_planificados = :total_ingresos_planificados,
        total_gastos_planificados = :total_gastos_planificados,
        total_ahorro_planificado = :total_ahorro_planificado,
        estado = :estado,
        modificado_en = :modificado_en,
        modificado_por = :modificado_por
    WHERE id_presupuesto = :id_presupuesto;
END#