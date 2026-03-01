-- SP_INSERTAR_TRANSACCIONES
-- Inserta un nuevo registro en la tabla TRANSACCIONES y retorna el id generado.
RECREATE PROCEDURE SP_INSERTAR_TRANSACCIONES (
    p_id_usuario INTEGER,
    p_presupuesto_id INTEGER,
    p_anio INTEGER,
    p_mes INTEGER,
    p_subcategoria_id INTEGER,
    p_obligacion_id INTEGER,
    p_descripcion VARCHAR(500),
    p_monto NUMERIC(15,2),
    p_fecha DATE,
    p_no_factura VARCHAR(500),
    p_creado_por INTEGER
)
RETURNS (
    id_transacciones INTEGER
)
AS
BEGIN
    INSERT INTO TRANSACCIONES (
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
        creado_por
    )
    VALUES (
        :p_id_usuario,
        :p_presupuesto_id,
        :p_anio,
        :p_mes,
        :p_subcategoria_id,
        :p_obligacion_id,
        :p_descripcion,
        :p_monto,
        :p_fecha,
        :p_no_factura,
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id INTO id_transacciones;
    SUSPEND;
END
