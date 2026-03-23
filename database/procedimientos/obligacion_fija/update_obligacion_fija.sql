
CREATE PROCEDURE SP_ACTUALIZAR_OBLIGACION_FIJA (
    p_id_obligacion_fija INTEGER,
    p_id_usuario INTEGER,
    p_subcategoria_id INTEGER,
    p_nombre VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_dia_mes_expiracion INTEGER,
    p_monto NUMERIC(15,2),
    p_is_vigente BOOLEAN,
    p_fecha_inicio DATE,
    p_fecha_final DATE,
    p_modificado_por INTEGER
)
AS
DECLARE VARIABLE v_categoria_tipo VARCHAR(20);


BEGIN

    if (p_subcategoria_id IS NULL) THEN 
        EXCEPTION EX_OBLIGACION_SIN_SUBCATEGORIA;


    SELECT c.tipo_categoria
    FROM SUBCATEGORIA s
    INNER JOIN CATEGORIA c ON s.categoria_id = c.id
    WHERE s.id = :p_subcategoria_id
    INTO :v_categoria_tipo;
    
    IF (:v_categoria_tipo <> 'gasto') THEN
        EXCEPTION EX_OBLIGACION_SUBCATEGORIA_TIPO_INVALIDO;
    
    IF (:p_fecha_final IS NOT NULL) THEN
        IF (:p_fecha_final <= :p_fecha_inicio) THEN
            EXCEPTION EX_OBLIGACION_FECHA_FINAL_INVALIDA;
    
    UPDATE OBLIGACION_FIJA
    SET id_usuario = :p_id_usuario,
        subcategoria_id = :p_subcategoria_id,
        nombre = :p_nombre,
        descripcion = :p_descripcion,
        dia_mes_expiracion = :p_dia_mes_expiracion,
        monto= :p_monto,
        is_vigente = :p_is_vigente,
        fecha_inicio = :p_fecha_inicio,
        fecha_final = :p_fecha_final,
        modificado_en = CURRENT_TIMESTAMP,
        modificado_por = :p_modificado_por
    WHERE id = :p_id_obligacion_fija;
END#