-- SP_CONSULTAR_SUBCATEGORIA
-- Devuelve un único registro de la tabla SUBCATEGORIA según su id.
CREATE PROCEDURE SP_CONSULTAR_SUBCATEGORIA (
    p_id_subcategoria INTEGER
)
RETURNS (
    id INTEGER,
    categoria_id INTEGER,
    categoria_nombre VARCHAR(500),
    tipo_categoria VARCHAR(20),
    nombre VARCHAR(500),
    descripcion VARCHAR(500),
    is_default BOOLEAN,
    estado VARCHAR(20),
    creado_en TIMESTAMP,
    modificado_en TIMESTAMP,
    creado_por INTEGER,
    modificado_por INTEGER
)
AS
BEGIN
    FOR SELECT 
        s.id,
        s.categoria_id,
        c.nombre,
        c.tipo_categoria,
        s.nombre,
        s.descripcion,
        s.is_default,
        s.estado,
        s.creado_en,
        s.modificado_en,
        s.creado_por,
        s.modificado_por
    FROM SUBCATEGORIA s
    JOIN CATEGORIA c ON c.id = s.categoria_id
    WHERE s.id = :p_id_subcategoria
    INTO 
        :id,
        :categoria_id,
        :categoria_nombre,
        :tipo_categoria,
        :nombre,
        :descripcion,
        :is_default,
        :estado,
        :creado_en,
        :modificado_en,
        :creado_por,
        :modificado_por
    DO
        SUSPEND;
END#
