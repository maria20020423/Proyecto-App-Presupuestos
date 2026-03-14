CREATE FUNCTION FN_OBTENER_CATEGORIA_POR_SUBCATEGORIA (
    p_id_subcategoria INTEGER
)
RETURNS INTEGER
AS
DECLARE VARIABLE v_id_categoria INTEGER;
BEGIN
    SELECT categoria_id
    FROM SUBCATEGORIA
    WHERE id = :p_id_subcategoria
    INTO :v_id_categoria;

    RETURN v_id_categoria;
END#
