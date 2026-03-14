CREATE PROCEDURE SP_ACTUALIZAR_CATEGORIA (
    p_id_categoria INTEGER,
    p_nombre VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_category_icon VARCHAR(150),
    p_color_format VARCHAR(10),
    p_ui_order INTEGER,
    p_estado VARCHAR(20),
    p_modificado_por INTEGER
) AS
BEGIN
    UPDATE CATEGORIA
    SET nombre = COALESCE(:p_nombre, nombre),
        descripcion = COALESCE(:p_descripcion, descripcion),
        category_icon = COALESCE(:p_category_icon, category_icon),
        color_format = COALESCE(:p_color_format, color_format),
        ui_order = COALESCE(:p_ui_order, ui_order),
        estado = COALESCE(:p_estado, estado),
        modificado_por = :p_modificado_por,
        modificado_en = CURRENT_TIMESTAMP
    WHERE id = :p_id_categoria;
END#
