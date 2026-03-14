SET TERM #;

CREATE TRIGGER TR_CATEGORIA_CREATE_DEFAULT_SUB FOR CATEGORIA
ACTIVE AFTER INSERT POSITION 0
AS
DECLARE VARIABLE v_id_subcategoria INTEGER;
BEGIN
    INSERT INTO SUBCATEGORIA (
        categoria_id,
        nombre,
        descripcion,
        is_default,
        estado,
        creado_en,
        creado_por
    )
    VALUES (
        NEW.id,
        'General',
        'Subcategoria por defecto',
        TRUE,
        'activa',
        CURRENT_TIMESTAMP,
        NEW.creado_por
    )
    RETURNING id INTO :v_id_subcategoria;
END#

SET TERM ;#
