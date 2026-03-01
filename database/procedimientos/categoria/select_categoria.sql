CREATE OR ALTER PROCEDURE SP_CONSULTAR_CATEGORIA (
    p_id_categoria INTEGER
)
RETURNS (
    id INTEGER,
    nombre VARCHAR(500),
    descripcion VARCHAR(500),
    tipo_categoria INTEGER,
    category_icon VARCHAR(500),
    color_format VARCHAR(500),
    ui_order INTEGER,
    creado_en TIMESTAMP WITH TIME ZONE,
    modificado_en TIMESTAMP WITH TIME ZONE,
    creado_por INTEGER
)
AS
BEGIN
    FOR SELECT
        id,
        nombre,
        descripcion,
        tipo_categoria,
        category_icon,
        color_format,
        ui_order,
        creado_en,
        modificado_en,
        creado_por
    FROM
        CATEGORIA
    WHERE
        id = :p_id_categoria
    INTO
        :id,
        :nombre,
        :descripcion,
        :tipo_categoria,
        :category_icon,
        :color_format,
        :ui_order,
        :creado_en,
        :modificado_en,
        :creado_por
    DO
    BEGIN
        SUSPEND;
    END
END;