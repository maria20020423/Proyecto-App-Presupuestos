SET TERM #;

CREATE TRIGGER TR_CATEGORIA_CREATE_DEFAULT_SUB FOR CATEGORIA
ACTIVE AFTER INSERT POSITION 0
AS

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
END#

