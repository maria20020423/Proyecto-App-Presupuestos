-- SP_INSERTAR_SUBCATEGORIA
-- Inserta un nuevo registro en la tabla SUBCATEGORIA y retorna el id generado.
CREATE PROCEDURE SP_INSERTAR_SUBCATEGORIA (
    p_categoria_id INTEGER,
    p_nombre VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_is_default BOOLEAN,
    p_creado_por INTEGER
)
RETURNS (
    id_subcategoria INTEGER
)
AS
DECLARE VARIABLE v_categoria_estado VARCHAR(20);
DECLARE VARIABLE v_sub_default INTEGER;
BEGIN
    SELECT estado FROM CATEGORIA WHERE id = :p_categoria_id INTO :v_categoria_estado;
    IF (v_categoria_estado IS NULL) THEN
        EXCEPTION ex_categoria_no_encontrada;

    IF (:p_is_default = TRUE) THEN
    BEGIN
        SELECT COUNT(*)
        FROM SUBCATEGORIA
        WHERE categoria_id = :p_categoria_id
          AND is_default = TRUE
        INTO :v_sub_default;

        IF (v_sub_default > 0) THEN
            EXCEPTION ex_subcategoria_default_existente;
    END
    ELSE
    BEGIN
        SELECT COUNT(*)
        FROM SUBCATEGORIA
        WHERE categoria_id = :p_categoria_id
          AND estado = 'activa'
        INTO :v_sub_default;

        IF (v_sub_default = 0) THEN
            EXCEPTION ex_categoria_sin_subcategoria;
    END

    INSERT INTO SUBCATEGORIA (
        categoria_id,
        nombre,
        descripcion,
        is_default,
        estado,
        creado_por,
        creado_en
    )
    VALUES (
        :p_categoria_id,
        :p_nombre,
        :p_descripcion,
        COALESCE(:p_is_default, FALSE),
        'activa',
        :p_creado_por,
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO id_subcategoria;
    SUSPEND;
END#
