DROP PROCEDURE SP_ACTUALIZAR_USUARIO IF EXISTS;

CREATE PROCEDURE SP_ACTUALIZAR_USUARIO (
    p_id_usuario INTEGER,
    p_nombre VARCHAR(255),
    p_apellido VARCHAR(255),
    p_salario_mensual NUMERIC(15, 2),
    p_modificado_por VARCHAR(255)
) AS
BEGIN
    UPDATE USUARIO
    SET nombre = :p_nombre,
        apellido = :p_apellido,
        salario_mensual_base = :p_salario_mensual,
        modificado_por = :p_modificado_por,
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE id_usuario = :p_id_usuario;
END;