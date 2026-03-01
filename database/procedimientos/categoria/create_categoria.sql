CREATE PROCEDURE SP_INSERTAR_CATEGORIA (
    p_name VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_tipo_categoria INTEGER,
    p_category_icon VARCHAR(500),
    p_color_format VARCHAR(500),
    p_ui_order INTEGER,
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
        creado_en,
        creado_por
    )
    VALUES (
        :p_name,
        :p_descripcion,
        :p_tipo_categoria,
        :p_category_icon,
        :p_color_format,
        :p_ui_order,
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id INTO :id_categoria;
    SUSPEND;
END;