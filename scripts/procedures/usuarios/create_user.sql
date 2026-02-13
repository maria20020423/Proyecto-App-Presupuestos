SET TERM ^;
CREATE PROCEDURE CREATE_USUARIO (
    p_nombre VARCHAR(255),
    p_apellido VARCHAR(255),
    p_correo_electronico VARCHAR(255),
    p_fecha_registro TIMESTAMP WITH TIME ZONE,
    p_salario_mensual_base NUMERIC(15, 2),
    p_estado VARCHAR(20)
) RETURNS (id_usuario INTEGER) AS
BEGIN 
INSERT INTO USUARIO (id_usuario,nombre,apellido,correo_electronico,fecha_registro,salario_mensual_base,estado)
VALUES (NULL, :p_nombre, :p_apellido, :p_correo_electronico, :p_fecha_registro, :p_salario_mensual_base, :p_estado)
RETURNING id_usuario INTO id_usuario;
END^
SET TERM ;^
