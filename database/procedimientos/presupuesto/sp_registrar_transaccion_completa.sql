CREATE PROCEDURE SP_REGISTRAR_TRANSACCION_COMPLETA (
    p_id_usuario INTEGER,
    p_id_presupuesto INTEGER,
    p_anio INTEGER,
    p_mes INTEGER,
    p_id_subcategoria INTEGER,
    p_id_obligacion INTEGER,
    p_tipo VARCHAR(20),
    p_descripcion VARCHAR(500),
    p_monto NUMERIC(15, 2),
    p_fecha DATE,
    p_metodo_pago VARCHAR(30),
    p_no_factura VARCHAR(500),
    p_observaciones VARCHAR(500),
    p_creado_por INTEGER
)
RETURNS (
    id_transaccion INTEGER,
    mensaje VARCHAR(200)
)
AS
DECLARE VARIABLE v_presupuesto_usuario INTEGER;
DECLARE VARIABLE v_presupuesto_estado VARCHAR(20);
DECLARE VARIABLE v_anio_inicio INTEGER;
DECLARE VARIABLE v_mes_inicio INTEGER;
DECLARE VARIABLE v_anio_fin INTEGER;
DECLARE VARIABLE v_mes_fin INTEGER;
DECLARE VARIABLE v_tipo_categoria VARCHAR(20);
DECLARE VARIABLE v_categoria_usuario INTEGER;
DECLARE VARIABLE v_obl_usuario INTEGER;
DECLARE VARIABLE v_obl_subcategoria INTEGER;
DECLARE VARIABLE v_obl_vigente BOOLEAN;
DECLARE VARIABLE v_obl_inicio DATE;
DECLARE VARIABLE v_obl_fin DATE;
DECLARE VARIABLE v_clave_fecha INTEGER;
DECLARE VARIABLE v_clave_inicio INTEGER;
DECLARE VARIABLE v_clave_fin INTEGER;
BEGIN
    IF (p_monto IS NULL OR p_monto <= 0) THEN
        EXCEPTION ex_transaccion_monto_invalido;

    IF (p_mes IS NULL OR p_mes < 1 OR p_mes > 12) THEN
        EXCEPTION ex_transaccion_mes_invalido;

    IF (COALESCE(LOWER(p_tipo), '') <> 'ingreso' AND COALESCE(LOWER(p_tipo), '') <> 'gasto' AND COALESCE(LOWER(p_tipo), '') <> 'ahorro') THEN
        EXCEPTION ex_transaccion_tipo_invalido;

    SELECT id_usuario, estado, anio_inicio, mes_inicio, anio_fin, mes_fin
    FROM PRESUPUESTO
    WHERE id_presupuesto = :p_id_presupuesto
    INTO :v_presupuesto_usuario, :v_presupuesto_estado, :v_anio_inicio, :v_mes_inicio, :v_anio_fin, :v_mes_fin;

    IF (v_presupuesto_usuario IS NULL) THEN
        EXCEPTION ex_presupuesto_no_encontrado;

    IF (v_presupuesto_usuario <> p_id_usuario) THEN
        EXCEPTION ex_presupuesto_usuario;

    IF (v_presupuesto_estado <> 'activo') THEN
        EXCEPTION ex_presupuesto_estado;

    IF (FN_VALIDAR_VIGENCIA_PRESUPUESTO(:p_anio, :p_mes, :p_id_presupuesto) = 0) THEN
        EXCEPTION ex_presupuesto_fuera_vigencia;

    IF (p_fecha IS NULL) THEN
        EXCEPTION ex_transaccion_fecha_fuera_rango;

    v_clave_fecha = EXTRACT(YEAR FROM :p_fecha) * 100 + EXTRACT(MONTH FROM :p_fecha);
    v_clave_inicio = :v_anio_inicio * 100 + :v_mes_inicio;
    v_clave_fin = :v_anio_fin * 100 + :v_mes_fin;

    IF (v_clave_fecha < v_clave_inicio OR v_clave_fecha > v_clave_fin) THEN
        EXCEPTION ex_transaccion_fecha_fuera_rango;

    SELECT c.tipo_categoria, c.id_usuario
    FROM SUBCATEGORIA s
    INNER JOIN CATEGORIA c ON c.id = s.categoria_id
    WHERE s.id = :p_id_subcategoria
    INTO :v_tipo_categoria, :v_categoria_usuario;

    IF (v_tipo_categoria IS NULL) THEN
        EXCEPTION ex_subcategoria_no_encontrada;

    IF (LOWER(v_tipo_categoria) <> LOWER(p_tipo)) THEN
        EXCEPTION ex_transaccion_tipo_invalido;

    IF (v_categoria_usuario <> p_id_usuario) THEN
        EXCEPTION ex_transaccion_categoria_invalida;

    IF (p_id_obligacion IS NOT NULL) THEN
    BEGIN
        SELECT id_usuario, subcategoria_id, is_vigente, fecha_inicio, COALESCE(fecha_final, DATE '9999-12-31')
        FROM OBLIGACION_FIJA
        WHERE id = :p_id_obligacion
        INTO :v_obl_usuario, :v_obl_subcategoria, :v_obl_vigente, :v_obl_inicio, :v_obl_fin;

        IF (v_obl_usuario IS NULL) THEN
            EXCEPTION ex_obligacion_no_encontrada;

        IF (v_obl_usuario <> p_id_usuario OR v_obl_subcategoria <> p_id_subcategoria OR v_obl_vigente = FALSE) THEN
            EXCEPTION ex_transaccion_obligacion_invalida;

        IF (p_fecha < v_obl_inicio OR p_fecha > v_obl_fin) THEN
            EXCEPTION ex_transaccion_obligacion_invalida;
    END

    INSERT INTO TRANSACCIONES (
        id_usuario,
        presupuesto_id,
        anio,
        mes,
        subcategoria_id,
        obligacion_id,
        tipo,
        descripcion,
        monto,
        fecha,
        metodo_pago,
        no_factura,
        observaciones,
        estado,
        creado_en,
        creado_por
    )
    VALUES (
        :p_id_usuario,
        :p_id_presupuesto,
        :p_anio,
        :p_mes,
        :p_id_subcategoria,
        :p_id_obligacion,
        LOWER(:p_tipo),
        :p_descripcion,
        :p_monto,
        :p_fecha,
        :p_metodo_pago,
        :p_no_factura,
        :p_observaciones,
        'activo',
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id INTO :id_transaccion;

    mensaje = 'Transaccion registrada correctamente';
    SUSPEND;
END#
