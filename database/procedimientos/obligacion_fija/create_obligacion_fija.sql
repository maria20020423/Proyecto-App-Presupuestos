CREATE PROCEDURE SP_INSERTAR_OBLIGACION_FIJA (
    p_id_usuario INTEGER,
    p_subcategoria_id INTEGER,
    p_nombre VARCHAR(500),
    p_descripcion VARCHAR(500),
    p_dia_mes_expiracion INTEGER,
    p_monto NUMERIC(15,2),
    p_is_vigente BOOLEAN,
    p_fecha_inicio DATE,
    p_fecha_final DATE,
    p_creado_por INTEGER
)
RETURNS (
    id_obligacion_fija INTEGER
)
AS
DECLARE VARIABLE v_categoria_tipo VARCHAR(20);
BEGIN

    
    
    SELECT c.tipo_categoria
    FROM SUBCATEGORIA s
    JOIN CATEGORIA c ON s.categoria_id = c.id
    WHERE s.id = :p_subcategoria_id
    INTO :v_categoria_tipo;
    
    IF (:v_categoria_tipo <> 'gasto') THEN
        EXCEPTION EX_OBLIGACION_SUBCATEGORIA_TIPO_INVALIDO;
    

    IF (:p_fecha_final IS NOT NULL) THEN
        IF (:p_fecha_final <= :p_fecha_inicio) THEN
            EXCEPTION EX_OBLIGACION_FECHA_FINAL_INVALIDA;
            
    INSERT INTO OBLIGACION_FIJA (
        id_usuario,
        subcategoria_id,
        nombre,
        descripcion,
        dia_mes_expiracion,
        monto,
        is_vigente,
        fecha_inicio,
        fecha_final,
        creado_en,
        creado_por
    )
    VALUES (
        :p_id_usuario,
        :p_subcategoria_id,
        :p_nombre,
        :p_descripcion,
        :p_dia_mes_expiracion,
        :p_monto,
        :p_is_vigente,
        :p_fecha_inicio,
        :p_fecha_final,
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id INTO id_obligacion_fija;
    SUSPEND;
END#