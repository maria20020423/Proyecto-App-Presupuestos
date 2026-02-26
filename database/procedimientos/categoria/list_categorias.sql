DROP PROCEDURE SP_LISTAR_CATEGORIAS IF EXISTS;

CREATE PROCEDURE SP_LISTAR_CATEGORIAS ()
RETURNS (
    id_categoria INTEGER,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    estado VARCHAR(20)
) AS
BEGIN
    FOR SELECT id_categoria, nombre, descripcion, estado
        FROM CATEGORIA
        INTO :id_categoria, :nombre, :descripcion, :estado
    DO
        SUSPEND;
END;