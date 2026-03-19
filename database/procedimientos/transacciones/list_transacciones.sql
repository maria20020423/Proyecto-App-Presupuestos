CREATE OR ALTER PROCEDURE SP_LISTAR_TRANSACCIONES
RETURNS (
    id INTEGER,
    id_usuario INTEGER,
    presupuesto_id INTEGER,
    anio INTEGER,
    mes INTEGER,
    subcategoria_id INTEGER,
    obligacion_id INTEGER,
    tipo VARCHAR(20),
    descripcion VARCHAR(500),
    monto NUMERIC(15,2),
    fecha DATE,
    metodo_pago VARCHAR(30),
    no_factura VARCHAR(500),
    observaciones VARCHAR(500),
    estado VARCHAR(20),
    creado_en TIMESTAMP,
    modificado_en TIMESTAMP,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    FOR SELECT 
        id, id_usuario, presupuesto_id, anio, mes, 
        subcategoria_id, obligacion_id, tipo, descripcion, 
        monto, fecha, metodo_pago, no_factura, observaciones, 
        estado, creado_en, modificado_en, creado_por, modificado_por
    FROM TRANSACCIONES
    INTO 
        :id, :id_usuario, :presupuesto_id, :anio, :mes, 
        :subcategoria_id, :obligacion_id, :tipo, :descripcion, 
        :monto, :fecha, :metodo_pago, :no_factura, :observaciones, 
        :estado, :creado_en, :modificado_en, :creado_por, :modificado_por
    DO
    BEGIN
        SUSPEND;
    END
END#