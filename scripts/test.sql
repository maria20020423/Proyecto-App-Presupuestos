CREATE PROCEDURE SP_INSERTAR_PRESUPUESTO (
    id_usuario INTEGER,
    nombre_presupuesto VARCHAR(255),
    anio_inicio INTEGER,
    mes_inicio INTEGER,
    anio_fin INTEGER,
    mes_fin INTEGER,
    total_ingresos_planificados NUMERIC(15, 2),
    total_gastos_planificados NUMERIC(15, 2),
    total_ahorro_planificado NUMERIC(15, 2),
    fecha_creacion TIMESTAMP,
    estado VARCHAR(20),
    creado_en TIMESTAMP,
    creado_por INTEGER
) RETURNS (nuevo_id_presupuesto INTEGER) AS
DECLARE VARIABLE v_overlap INTEGER;

BEGIN 
SELECT COUNT(*)
FROM PRESUPUESTO
WHERE id_usuario = :id_usuario
    AND estado = 'activo'

    AND (anio_inicio * 100 + mes_inicio) <= (:anio_fin * 100 + :mes_fin)
    AND (anio_fin * 100 + mes_fin) >= (:anio_inicio * 100 + :mes_inicio) INTO :v_overlap;

IF (:v_overlap > 0) THEN EXCEPTION EX_PRESUPUESTO_TRASLAPADO;

INSERT INTO PRESUPUESTO (
        id_usuario,
        nombre_presupuesto,
        anio_inicio,
        mes_inicio,
        anio_fin,
        mes_fin,
        total_ingresos_planificados,
        total_gastos_planificados,
        total_ahorro_planificado,
        fecha_creacion,
        estado,
        creado_en,
        creado_por
    )
VALUES (
        :id_usuario,
        :nombre_presupuesto,
        :anio_inicio,
        :mes_inicio,
        :anio_fin,
        :mes_fin,
        :total_ingresos_planificados,
        :total_gastos_planificados,
        :total_ahorro_planificado,
        :fecha_creacion,
        :estado,
        :creado_en,
        :creado_por
    )
RETURNING id_presupuesto INTO nuevo_id_presupuesto;
SUSPEND;
END ;

SET TERM #;

-- ============================================================
-- SECCIÓN 1: PRUEBAS DE USUARIO
-- ============================================================

-- Test 1.1: Crear usuario de prueba
EXECUTE PROCEDURE SP_INSERTAR_USUARIO(
    'Juan',
    'Pérez',
    'juan.perez@test.com',
    5000.00
);

-- Verificar usuario creado
SELECT * FROM SP_LISTAR_USUARIOS;

-- Test 1.2: Consultar usuario específico (asumiendo ID=1)
SELECT * FROM SP_CONSULTAR_USUARIO(1);

-- Test 1.3: Actualizar usuario
EXECUTE PROCEDURE SP_ACTUALIZAR_USUARIO(
    1,
    'Juan Carlos',
    'Pérez López',
    6000.00
);

-- ============================================================
-- SECCIÓN 2: PRUEBAS DE CATEGORÍA
-- ============================================================

-- Test 2.1: Crear categoría de tipo INGRESO
EXECUTE PROCEDURE SP_INSERTAR_CATEGORIA(
    1,                      -- p_id_usuario
    'Salario Principal',    -- p_nombre
    'Ingresos mensuales',   -- p_descripcion
    'ingreso',              -- p_tipo_categoria
    'wallet',               -- p_category_icon
    '#4CAF50',              -- p_color_format
    1,                      -- p_ui_order
    'activa',               -- p_estado
    1                       -- p_creado_por
);

-- Test 2.2: Crear categoría de tipo GASTO
EXECUTE PROCEDURE SP_INSERTAR_CATEGORIA(
    1,
    'Servicios Públicos',
    'Pagos mensuales de servicios',
    'gasto',
    'bolt',
    '#F44336',
    2,
    'activa',
    1
);

-- Test 2.3: Crear categoría de tipo AHORRO
EXECUTE PROCEDURE SP_INSERTAR_CATEGORIA(
    1,
    'Fondo Emergencias',
    'Ahorro para emergencias',
    'ahorro',
    'savings',
    '#2196F3',
    3,
    'activa',
    1
);

-- Verificar categorías creadas
SELECT * FROM SP_LISTAR_CATEGORIAS(1, NULL);

-- ============================================================
-- SECCIÓN 3: PRUEBAS DE SUBCATEGORÍA
-- ============================================================

-- Test 3.1: Crear subcategoría para categoría INGRESO (ID=1)
EXECUTE PROCEDURE SP_INSERTAR_SUBCATEGORIA(
    1,                      -- p_categoria_id
    'Sueldo Base',          -- p_nombre
    'Salario mensual base', -- p_descripcion
    FALSE,                   -- p_is_default
    1                       -- p_creado_por
);

-- Test 3.2: Crear subcategoría para categoría GASTO (ID=2)
EXECUTE PROCEDURE SP_INSERTAR_SUBCATEGORIA(
    2,                      -- p_categoria_id (Servicios Públicos)
    'Electricidad',         -- p_nombre
    'Pago de luz',          -- p_descripcion
    FALSE,                   -- p_is_default
    1                       -- p_creado_por
);

-- Test 3.3: Crear segunda subcategoría de gasto
EXECUTE PROCEDURE SP_INSERTAR_SUBCATEGORIA(
    2,                      -- p_categoria_id
    'Agua',                 -- p_nombre
    'Pago de agua potable', -- p_descripcion
    FALSE,                  -- p_is_default
    1                       -- p_creado_por
);

-- Test 3.4: Crear subcategoría para AHORRO (ID=3)
EXECUTE PROCEDURE SP_INSERTAR_SUBCATEGORIA(
    3,                      -- p_categoria_id (Fondo Emergencias)
    'Reserva Mensual',      -- p_nombre
    'Depósito mensual',     -- p_descripcion
    FALSE,                   -- p_is_default
    1                       -- p_creado_por
);

-- Verificar subcategorías
SELECT * FROM SP_LISTAR_SUBCATEGORIAS_POR_CATEGORIA(1);

-- ============================================================
-- SECCIÓN 4: PRUEBAS DE PRESUPUESTO
-- ============================================================

-- Test 4.1: Crear presupuesto mensual
EXECUTE PROCEDURE SP_INSERTAR_PRESUPUESTO(
    1,                          -- id_usuario
    'Presupuesto Marzo 2026',   -- nombre_presupuesto
    2026,                       -- anio_inicio
    3,                          -- mes_inicio
    2026,                       -- anio_fin
    3,                          -- mes_fin
    6000.00,                    -- total_ingresos_planificados
    3000.00,                    -- total_gastos_planificados
    1000.00,                    -- total_ahorro_planificado
    CURRENT_TIMESTAMP,          -- fecha_creacion
    'activo',                   -- estado
    CURRENT_TIMESTAMP,          -- creado_en
    1                           -- creado_por
);

-- Verificar presupuesto creado
SELECT * FROM SP_LISTAR_PRESUPUESTOS(1,'activo');

-- ============================================================
-- SECCIÓN 5: PRUEBAS DE DETALLE_PRESUPUESTO
-- ============================================================

-- Test 5.1: Agregar detalle de ingreso (subcategoria_id=1 - Sueldo Base)
EXECUTE PROCEDURE SP_INSERTAR_DETALLE_PRESUPUESTO(
    1,              -- p_id_presupuesto
    1,              -- p_id_subcategoria (Sueldo Base)
    6000.00,        -- p_monto_mensual
    'Salario mensual',
    1               -- p_creado_por
);

-- Test 5.2: Agregar detalle de gasto - Electricidad (subcategoria_id=2)
EXECUTE PROCEDURE SP_INSERTAR_DETALLE_PRESUPUESTO(
    1,              -- p_id_presupuesto
    2,              -- p_id_subcategoria (Electricidad)
    150.00,         -- p_monto_mensual
    'Pago promedio luz',
    1               -- p_creado_por
)#
COMMIT#

-- Test 5.3: Agregar detalle de gasto - Agua (subcategoria_id=3)
EXECUTE PROCEDURE SP_INSERTAR_DETALLE_PRESUPUESTO(
    1,              -- p_id_presupuesto
    3,              -- p_id_subcategoria (Agua)
    50.00,          -- p_monto_mensual
    'Pago promedio agua',
    1               -- p_creado_por
)#
COMMIT#

-- Test 5.4: Agregar detalle de ahorro (subcategoria_id=4 - Reserva Mensual)
EXECUTE PROCEDURE SP_INSERTAR_DETALLE_PRESUPUESTO(
    1,              -- p_id_presupuesto
    4,              -- p_id_subcategoria (Reserva Mensual)
    1000.00,        -- p_monto_mensual
    'Meta mensual de ahorro',
    1               -- p_creado_por
)#
COMMIT#

-- Verificar detalles del presupuesto
SELECT * FROM SP_LISTAR_DETALLE_PRESUPUESTO(1);
COMMIT#

-- ============================================================
-- SECCIÓN 6: PRUEBAS DE OBLIGACIÓN_FIJA
-- ============================================================

-- Test 6.1: Crear obligación fija (requiere subcategoría tipo GASTO - ID=2)
EXECUTE PROCEDURE SP_INSERTAR_OBLIGACION_FIJA(
    1,                  -- p_id_usuario
    2,                  -- p_subcategoria_id (Electricidad - tipo gasto)
    'Pago CFE Marzo',   -- p_nombre
    'Recibo de luz marzo 2026', -- p_descripcion
    15,                 -- p_dia_mes_expiracion (vence día 15)
    150.00,             -- p_monto
    TRUE,               -- p_is_vigente
    DATE '2026-01-01',  -- p_fecha_inicio
    NULL,               -- p_fecha_final (sin fecha final)
    1                   -- p_creado_por
);

-- Test 6.2: Crear obligación fija con fecha final
EXECUTE PROCEDURE SP_INSERTAR_OBLIGACION_FIJA(
    1,                  -- p_id_usuario
    9,                  -- p_subcategoria_id (Agua - tipo gasto)
    'Pago Agua Marzo',  -- p_nombre
    'Recibo de agua',   -- p_descripcion
    20,                 -- p_dia_mes_expiracion (vence día 20)
    50.00,              -- p_monto
    TRUE,               -- p_is_vigente
    DATE '2026-01-01',  -- p_fecha_inicio
    DATE '2026-12-31',  -- p_fecha_final
    1                   -- p_creado_por
);
-- Verificar obligaciones creadas
SELECT * FROM SP_LISTAR_OBLIGACION_FIJA(1, NULL);
-- ============================================================
-- SECCIÓN 7: PRUEBAS DE TRANSACCIONES
-- ============================================================



-- SP_INSERTAR_TRANSACCIONES
-- Inserta un nuevo registro en la tabla TRANSACCIONES y retorna el id generado.
CREATE PROCEDURE SP_INSERTAR_TRANSACCIONES (
    p_id_usuario INTEGER,
    p_presupuesto_id INTEGER,
    p_anio INTEGER,
    p_mes INTEGER,
    p_subcategoria_id INTEGER,
    p_obligacion_id INTEGER,
    p_tipo VARCHAR(20),
    p_descripcion VARCHAR(500),
    p_monto NUMERIC(15,2),
    p_fecha DATE,
    p_metodo_pago VARCHAR(30),
    p_no_factura VARCHAR(500),
    p_observaciones VARCHAR(500),
    p_creado_por INTEGER
)
RETURNS (
    id_transacciones INTEGER
)
AS
BEGIN
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
        creado_en,
        creado_por
    )
    VALUES (
        :p_id_usuario,
        :p_presupuesto_id,
        :p_anio,
        :p_mes,
        :p_subcategoria_id,
        :p_obligacion_id,
        :p_tipo,
        :p_descripcion,
        :p_monto,
        :p_fecha,
        :p_metodo_pago,
        :p_no_factura,
        :p_observaciones,
        CURRENT_TIMESTAMP,
        :p_creado_por
    )
    RETURNING id INTO id_transacciones;
    SUSPEND;
END

-- Test 7.1: Registrar ingreso (subcategoria_id=1 - Sueldo Base)
EXECUTE PROCEDURE SP_INSERTAR_TRANSACCIONES(
    1,                  -- p_id_usuario
    1,                  -- p_presupuesto_id
    2026,               -- p_anio
    3,                  -- p_mes
    1,                  -- p_subcategoria_id (Sueldo Base)
    NULL,               -- p_obligacion_id
    'ingreso',          -- p_tipo
    'Salario marzo',    -- p_descripcion
    6000.00,            -- p_monto
    DATE '2026-03-01',  -- p_fecha
    'transferencia',    -- p_metodo_pago
    NULL,               -- p_no_factura
    'Depósito mensual', -- p_observaciones
    1                   -- p_creado_por
);

-- Test 7.2: Registrar gasto (subcategoria_id=2 - Electricidad)
EXECUTE PROCEDURE SP_INSERTAR_TRANSACCIONES(
    1,                  -- p_id_usuario
    1,                  -- p_presupuesto_id
    2026,               -- p_anio
    3,                  -- p_mes
    2,                  -- p_subcategoria_id (Electricidad)
    1,                  -- p_obligacion_id (obligación fija #1)
    'gasto',            -- p_tipo
    'Recibo luz marzo', -- p_descripcion
    145.50,             -- p_monto
    DATE '2026-03-15',  -- p_fecha
    'tarjeta_credito',  -- p_metodo_pago
    'CFE-123456',       -- p_no_factura
    'Pago servicio',    -- p_observaciones
    1                   -- p_creado_por
);

-- Test 7.3: Registrar ahorro (subcategoria_id=4 - Reserva Mensual)
EXECUTE PROCEDURE SP_INSERTAR_TRANSACCIONES(
    1,                  -- p_id_usuario
    1,                  -- p_presupuesto_id
    2026,               -- p_anio
    3,                  -- p_mes
    4,                  -- p_subcategoria_id (Reserva Mensual)
    NULL,               -- p_obligacion_id
    'ahorro',           -- p_tipo
    'Ahorro marzo',     -- p_descripcion
    1000.00,            -- p_monto
    DATE '2026-03-01',  -- p_fecha
    'transferencia',    -- p_metodo_pago
    NULL,               -- p_no_factura
    'Ahorro mensual',   -- p_observaciones
    1                   -- p_creado_por
);

-- Verificar transacciones
SELECT * FROM SP_LISTAR_TRANSACCIONES_PRESUPUESTO(1,2026,3,'gasto');

-- ============================================================
-- SECCIÓN 8: PRUEBAS DE META_AHORRO
-- ============================================================

-- Test 8.1: Crear meta de ahorro
EXECUTE PROCEDURE SP_INSERTAR_META_AHORRO(
    1,                          -- p_id_usuario
    'Vacaciones 2026',          -- p_nombre
    'Ahorro para vacaciones de verano', -- p_descripcion
    15000.00,                   -- p_monto_objetivo
    3000.00,                    -- p_monto_acumulado
    DATE '2026-07-01',          -- p_fecha_objetivo
    'activo',                   -- p_estado
    2,                          -- p_prioridad (1-5, menor es más prioridad)
    1250.00,                    -- p_promedio_ahorro_mensual
    CURRENT_DATE,               -- p_fecha_inicio
    NULL,                       -- p_fecha_completada
    1                           -- p_creado_por
);

-- Verificar metas creadas
SELECT * FROM SP_LISTAR_META_AHORRO;

-- ============================================================
-- SECCIÓN 9: PRUEBAS DE FUNCIONES AUXILIARES
-- ============================================================

-- Test 9.1: Calcular monto ejecutado para subcategoría
SELECT FN_CALCULAR_MONTO_EJECUTADO(1, 1, 2026, 3) AS monto_ejecutado_sueldo FROM RDB$DATABASE;
COMMIT#

-- Test 9.2: Calcular monto presupuestado para subcategoría
SELECT FN_CALCULAR_MONTO_PRESUPUESTADO_SUBCATEGORIA(1, 1) AS monto_presupuestado FROM RDB$DATABASE;
COMMIT#

-- Test 9.3: Calcular porcentaje ejecutado
SELECT FN_CALCULAR_PORCENTAJE_EJECUTADO(2, 1, 2026, 3) AS porcentaje_ejecutado FROM RDB$DATABASE;
-- Test 9.4: Calcular balance de subcategoría
SELECT FN_OBTENER_BALANCE_SUBCATEGORIA(1, 2, 2026, 3) AS balance_electricidad FROM RDB$DATABASE;


-- Test 9.5: Días hasta vencimiento de obligación
SELECT FN_DIAS_HASTA_VENCIMIENTO(1) AS dias_vencimiento FROM RDB$DATABASE;

-- Test 9.6: Validar vigencia de presupuesto
SELECT FN_VALIDAR_VIGENCIA_PRESUPUESTO(2026, 3, 1) AS es_vigente FROM RDB$DATABASE;

-- ============================================================
-- SECCIÓN 10: PRUEBAS DE EXCEPCIONES (ERRORES ESPERADOS)
-- ============================================================

-- Test 10.1: Intentar crear obligación con subcategoría no-gasto (debe fallar)
-- Este bloque debería lanzar EX_OBLIGACION_SUBCATEGORIA_TIPO_INVALIDO
  EXECUTE PROCEDURE SP_INSERTAR_OBLIGACION_FIJA(
            1, 1, 'Error', 'Error', 15, 100.00, TRUE, CURRENT_DATE, NULL, 1
        );

