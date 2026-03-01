RECREATE PROCEDURE SP_CONSULTAR_USUARIO (
    p_id_usuario INTEGER
) RETURNS (
    id_usuario INTEGER,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    correo_electronico VARCHAR(255),
    salario_mensual_base NUMERIC(15, 2),
    estado VARCHAR(20)
) AS
BEGIN
    SELECT id_usuario, nombre, apellido, correo_electronico, salario_mensual_base, estado
    FROM USUARIO
    WHERE id_usuario = :p_id_usuario
    INTO :id_usuario, :nombre, :apellido, :correo_electronico, :salario_mensual_base, :estado;
    
    IF (id_usuario IS NOT NULL) THEN
        SUSPEND;
END