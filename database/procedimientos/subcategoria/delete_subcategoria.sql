-- SP_ELIMINAR_SUBCATEGORIA
-- Realiza un soft delete actualizando el campo estado a 'inactivo' en la tabla SUBCATEGORIA.
CREATE PROCEDURE SP_ELIMINAR_SUBCATEGORIA (
    p_id_subcategoria INTEGER
)
AS
DECLARE VARIABLE v_is_default BOOLEAN;
DECLARE VARIABLE v_categoria_id INTEGER;
DECLARE VARIABLE v_en_uso INTEGER;
DECLARE VARIABLE v_subs_activas INTEGER;
BEGIN
    SELECT is_default, categoria_id
    FROM SUBCATEGORIA
    WHERE id = :p_id_subcategoria
    INTO :v_is_default, :v_categoria_id;

    IF (v_is_default IS NULL) THEN
        EXCEPTION ex_subcategoria_no_encontrada;

    IF (v_is_default = TRUE) THEN
        EXCEPTION ex_subcategoria_default_no_eliminar;

    SELECT COUNT(*)
    FROM DETALLE_PRESUPUESTO
    WHERE subcategoria_id = :p_id_subcategoria
      AND estado = 'activo'
    INTO :v_en_uso;

    IF (v_en_uso > 0) THEN
        EXCEPTION ex_subcategoria_usada_detalle;

    SELECT COUNT(*)
    FROM TRANSACCIONES
    WHERE subcategoria_id = :p_id_subcategoria
    INTO :v_en_uso;

    IF (v_en_uso > 0) THEN
        EXCEPTION ex_subcategoria_usada_transaccion;

    SELECT COUNT(*)
    FROM SUBCATEGORIA
    WHERE categoria_id = :v_categoria_id
      AND estado = 'activa'
      AND id <> :p_id_subcategoria
    INTO :v_subs_activas;

    IF (v_subs_activas = 0) THEN
        EXCEPTION ex_categoria_sin_subcategoria;

    UPDATE SUBCATEGORIA
    SET estado = 'inactiva',
        modificado_en = CURRENT_TIMESTAMP
    WHERE id = :p_id_subcategoria;
END#
