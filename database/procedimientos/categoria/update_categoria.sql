CREATE PROCEDURE SP_ACTUALIZAR_CATEGORIA (
    p_id_categoria INTEGER,
    p_nombre VARCHAR(255),
    p_tipo_categoria INTEGER,
    p_descripcion VARCHAR(255),
    p_modificado_por VARCHAR(255)
) AS
BEGIN
    UPDATE CATEGORIA
    SET nombre = :p_nombre,
        descripcion = :p_descripcion,
        tipo_categoria = :p_tipo_categoria,
        modificado_por = :p_modificado_por,
        modificado_en= CURRENT_TIMESTAMP
    WHERE id= :p_id_categoria;
END;