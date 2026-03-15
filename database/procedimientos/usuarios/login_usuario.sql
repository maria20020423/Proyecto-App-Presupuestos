CREATE PROCEDURE SP_LOGIN_USUARIO (
    p_correo_electronico VARCHAR(255)
) RETURNS (
    id_usuario INTEGER,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    correo_electronico VARCHAR(255),
    salario_mensual_base NUMERIC(15, 2),
    estado VARCHAR(20)
) AS
BEGIN
    SELECT id_usuario,
           nombre,
           apellido,
           correo_electronico,
           salario_mensual_base,
           estado
    FROM USUARIO
    WHERE LOWER(correo_electronico) = LOWER(:p_correo_electronico)
    ROWS 1
    INTO :id_usuario,
         :nombre,
         :apellido,
         :correo_electronico,
         :salario_mensual_base,
         :estado;

    IF (id_usuario IS NOT NULL) THEN
        SUSPEND;
END#
