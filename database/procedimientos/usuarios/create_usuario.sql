DROP PROCEDURE SP_INSERTAR_USUARIO IF EXISTS;

CREATE PROCEDURE SP_INSERTAR_USUARIO (
    p_nombre VARCHAR(255),
    p_apellido VARCHAR(255),
    p_email VARCHAR(255),
    p_salario_mensual NUMERIC(15, 2),
    p_creado_por VARCHAR(255)
) RETURNS (id_usuario INTEGER) AS
BEGIN
    INSERT INTO USUARIO (
        nombre,
        apellido,
        correo_electronico,
        salario_mensual_base,
        creado_por,
        estado
    )
    VALUES (
        :p_nombre,
        :p_apellido,
        :p_email,
        :p_salario_mensual,
        :p_creado_por,
        'activo'
    )
    RETURNING id_usuario INTO :id_usuario;
END;