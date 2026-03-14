CREATE PROCEDURE SP_ELIMINAR_CATEGORIA (
    p_id_categoria INTEGER
)
AS
DECLARE VARIABLE v_subcategorias_activas INTEGER;
BEGIN
    SELECT COUNT(*)
    FROM SUBCATEGORIA
    WHERE categoria_id = :p_id_categoria
      AND estado = 'activa'
      AND is_default = FALSE
    INTO :v_subcategorias_activas;

    IF (v_subcategorias_activas > 0) THEN
        EXCEPTION ex_categoria_con_subcategorias;

    UPDATE SUBCATEGORIA
    SET estado = 'inactiva',
        modificado_en = CURRENT_TIMESTAMP
    WHERE categoria_id = :p_id_categoria;

    UPDATE CATEGORIA
    SET estado = 'inactiva',
        modificado_en = CURRENT_TIMESTAMP
    WHERE id = :p_id_categoria;
END#
