CREATE PROCEDURE SP_INSERTAR_CATEGORIA (
    p_id_usuario INTEGER,
    p_nombre VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_tipo_categoria VARCHAR(20),
    p_category_icon VARCHAR(150),
    p_color_format VARCHAR(10),
    p_ui_order INTEGER,
    p_estado VARCHAR(20),
    p_creado_por INTEGER
)
RETURNS (
    id_categoria INTEGER
)
AS
BEGIN
    INSERT INTO CATEGORIA (
        nombre,
        descripcion,
        tipo_categoria,
        category_icon,
        color_format,
        ui_order,
        id_usuario,
        estado,
        creado_por,
        creado_en
    )
    VALUES (
        :p_nombre,
        :p_descripcion,
        :p_tipo_categoria,
        :p_category_icon,
        :p_color_format,
        COALESCE(:p_ui_order, 0),
        :p_id_usuario,
        COALESCE(:p_estado, 'activa'),
        :p_creado_por,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO id_categoria;
    SUSPEND;
END#
