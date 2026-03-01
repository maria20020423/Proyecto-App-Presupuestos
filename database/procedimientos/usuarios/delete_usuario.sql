RECREATE PROCEDURE SP_ELIMINAR_USUARIO (
    p_id_usuario INTEGER
) AS
BEGIN
    UPDATE USUARIO
    SET estado = 'inactivo',
        modificado_en = CURRENT_TIMESTAMP
    WHERE id_usuario = :p_id_usuario;
END