CREATE PROCEDURE SP_CONSULTAR_CATEGORIA (
    p_id_categoria INTEGER
)
RETURNS (
    id INTEGER,
    id_usuario INTEGER,
    nombre VARCHAR(500),
    descripcion VARCHAR(500),
    tipo_categoria VARCHAR(20),
    category_icon VARCHAR(150),
    color_format VARCHAR(10),
    ui_order INTEGER,
    estado VARCHAR(20),
    creado_en TIMESTAMP,
    modificado_en TIMESTAMP,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    FOR SELECT
        id,
        id_usuario,
        nombre,
        descripcion,
        tipo_categoria,
        category_icon,
        color_format,
        ui_order,
        estado,
        creado_en,
        modificado_en,
        creado_por,
        modificado_por
    FROM
        CATEGORIA
    WHERE
        id = :p_id_categoria
    INTO
        :id,
        :id_usuario,
        :nombre,
        :descripcion,
        :tipo_categoria,
        :category_icon,
        :color_format,
        :ui_order,
        :estado,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por
    DO
    BEGIN
        SUSPEND;
    END
END#
