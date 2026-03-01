-- SP_CONSULTAR_TRANSACCIONES
-- Devuelve un único registro de la tabla TRANSACCIONES según su id.
RECREATE PROCEDURE SP_CONSULTAR_TRANSACCIONES (
    p_id_transacciones INTEGER
)
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
    creado_en TIMESTAMP WITH TIME ZONE,
    modificado_en TIMESTAMP WITH TIME ZONE,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    SELECT 
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
    WHERE id = :p_id_transacciones
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
        :modificado_por;
    IF (id IS NOT NULL) THEN
        SUSPEND;
END
