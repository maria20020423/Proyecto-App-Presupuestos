-- SP_LISTAR_TRANSACCIONES
-- Devuelve todos los registros de la tabla TRANSACCIONES.
RECREATE PROCEDURE SP_LISTAR_TRANSACCIONES
RETURNS (
    id INTEGER,
    id_usuario INTEGER,
    presupuesto_id INTEGER,
    anio INTEGER,
    mes INTEGER,
    subcategoria_id INTEGER,
    obligacion_id INTEGER,
    descripcion VARCHAR(500),
    monto NUMERIC(15,2),
    fecha DATE,
    no_factura VARCHAR(500),
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
        presupuesto_id,
        anio,
        mes,
        subcategoria_id,
        obligacion_id,
        descripcion,
        monto,
        fecha,
        no_factura,
        creado_en,
        modificado_en,
        creado_por,
        modificado_por
    FROM TRANSACCIONES
    INTO 
        :id,
        :id_usuario,
        :presupuesto_id,
        :anio,
        :mes,
        :subcategoria_id,
        :obligacion_id,
        :descripcion,
        :monto,
        :fecha,
        :no_factura,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por
    DO
        SUSPEND;
END
