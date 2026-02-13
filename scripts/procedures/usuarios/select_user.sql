CREATE PROCEDURE SELECT_USER( p_id_usuario INTEGER) RETURN (
    id_usuario INTEGER,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    correo_electronico VARCHAR(255),
    fecha_registro TIMESTAMP WITH TIME ZONE,
    salario_mensual_base NUMERIC(15,2),
    estado VARCHAR(20)
) AS 
BEGIN
    FOR SELECT id_usuario, nombre, apellido, correo_electronico, fecha_registro, salario_mensual_base, estado
        FROM USUARIO
        WHERE id_usuario = :p_id_usuario
        INTO :id_usuario, :nombre, :apellido, :correo_electronico, :fecha_registro, :salario_mensual_base, :estado
    
    SUSPEND;
END;