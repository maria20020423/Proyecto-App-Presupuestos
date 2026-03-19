-- SP_ACTUALIZAR_TRANSACCIONES
-- Actualiza un registro existente en la tabla TRANSACCIONES.
CREATE PROCEDURE SP_ACTUALIZAR_TRANSACCIONES (
    p_id_transacciones INTEGER,
    p_id_usuario INTEGER,
    p_presupuesto_id INTEGER,
    p_anio INTEGER,
    p_mes INTEGER,
    p_subcategoria_id INTEGER,
    p_obligacion_id INTEGER,
    p_tipo VARCHAR(20),
    p_descripcion VARCHAR(500),
    p_monto NUMERIC(15,2),
    p_fecha DATE,
    p_metodo_pago VARCHAR(30),
    p_no_factura VARCHAR(500),
    p_observaciones VARCHAR(500),
    p_estado VARCHAR(20),
    p_modificado_por INTEGER
)
AS
BEGIN
    UPDATE TRANSACCIONES
    SET id_usuario = :p_id_usuario,
        presupuesto_id = :p_presupuesto_id,
        anio = :p_anio,
        mes = :p_mes,
        subcategoria_id = :p_subcategoria_id,
        obligacion_id = :p_obligacion_id,
        tipo = :p_tipo,
        descripcion = :p_descripcion,
        monto = :p_monto,
        fecha = :p_fecha,
        metodo_pago = :p_metodo_pago,
        no_factura = :p_no_factura,
        observaciones = :p_observaciones,
        estado = :p_estado,
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id = :p_id_transacciones;
END#
