DROP PROCEDURE SP_CONSULTAR_CATEGORIA IF EXISTS;

CREATE PROCEDURE SP_CONSULTAR_CATEGORIA (
    p_id_categoria INTEGER
) RETURNS (
    id_categoria INTEGER,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    estado VARCHAR(20)
) AS
BEGIN
    FOR SELECT id_categoria, nombre, descripcion, estado
        FROM CATEGORIA
        WHERE id_categoria = :p_id_categoria
        INTO :id_categoria, :nombre, :descripcion, :estado
    DO
        SUSPEND;
END;