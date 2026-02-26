DROP PROCEDURE SP_INSERTAR_CATEGORIA IF EXISTS;

CREATE PROCEDURE SP_INSERTAR_CATEGORIA (
    p_nombre VARCHAR(255),
    p_descripcion VARCHAR(255),
    p_creado_por VARCHAR(255)
) RETURNS (id_categoria INTEGER) AS
BEGIN
    INSERT INTO CATEGORIA (
        nombre,
        descripcion,
        creado_por,
        estado
    )
    VALUES (
        :p_nombre,
        :p_descripcion,
        :p_creado_por,
        'activo'
    )
    RETURNING id_categoria INTO :id_categoria;
END;