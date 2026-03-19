CREATE PROCEDURE SP_ELIMINAR_PRESUPUESTO (
    id_presupuesto INTEGER
)
AS
BEGIN
    DECLARE VARIABLE v_transacciones_asociadas INTEGER;
    SELECT COUNT(*)
    FROM TRANSACCION
    WHERE presupuesto_id = :id_presupuesto
    INTO :v_transacciones_asociadas;

    IF (v_transacciones_asociadas > 0) THEN
        EXCEPTION ex_presupuesto_con_transacciones;

    DELETE FROM PRESUPUESTO
    WHERE id_presupuesto = :id_presupuesto;
END#