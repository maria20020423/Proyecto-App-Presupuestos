DROP PROCEDURE SP_ACTUALIZAR_CATEGORIA IF EXISTS;

CREATE PROCEDURE SP_ACTUALIZAR_CATEGORIA (
    p_id_categoria INTEGER,
    p_nombre VARCHAR(255),
    p_descripcion VARCHAR(255),
    p_modificado_por VARCHAR(255)
) AS
BEGIN
    UPDATE CATEGORIA
    SET nombre = :p_nombre,
        descripcion = :p_descripcion,
        modificado_por = :p_modificado_por,
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE id_categoria = :p_id_categoria;
END;