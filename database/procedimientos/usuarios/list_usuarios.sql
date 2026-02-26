DROP PROCEDURE SP_LISTAR_USUARIOS IF EXISTS;

CREATE PROCEDURE SP_LISTAR_USUARIOS ()
RETURNS (
    id_usuario INTEGER,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    correo_electronico VARCHAR(255),
    salario_mensual_base NUMERIC(15, 2),
    estado VARCHAR(20)
) AS
BEGIN
    FOR SELECT id_usuario, nombre, apellido, correo_electronico, salario_mensual_base, estado
        FROM USUARIO
        INTO :id_usuario, :nombre, :apellido, :correo_electronico, :salario_mensual_base, :estado
    DO
        SUSPEND;
END;