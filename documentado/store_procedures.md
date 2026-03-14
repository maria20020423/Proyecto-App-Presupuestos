## Plan de Implementación: Procedimientos y Funciones de Presupuesto

### 1. Diagnóstico del Estado Actual
- **Tablas disponibles**: `PRESUPUESTO`, `DETALLE_PRESUPUESTO`, `TRANSACCIONES`, `OBLIGACION_FIJA`, `CATEGORIA`, `SUBCATEGORIA`, `USUARIO` cubren los campos requeridos (vigencias, estados, montos, auditoría).
- **Procedimientos CRUD**: Ya existen SP básicos para presupuesto y detalle; será necesario reutilizarlos dentro de los SP de negocio o replicar la lógica en transacciones explícitas.
- **Funciones existentes**: Ninguna definida aún (`database/funciones` vacío), por lo que todas las funciones solicitadas deberán crearse desde cero.

### 2. Utilidades Previas Requeridas
1. `fn_validar_vigencia_presupuesto(fecha, id_presupuesto)` → centraliza las validaciones de rango (año/mes). Será usada por `sp_registrar_transaccion_completa`, `sp_crear_presupuesto_completo`, `sp_cerrar_presupuesto` y funciones de cálculo.
2. `fn_obtener_categoria_por_subcategoria(id_subcategoria)` → retorna `categoria_id` y tipo; permite validar coherencia de transacciones y calcular totales por categoría.
3. `fn_calcular_monto_presupuestado_subcategoria(id_presupuesto, id_subcategoria)` → simplifica `sp_calcular_porcentaje_ejecucion_mes` y funciones derivadas.

### 3. Procedimientos de Lógica de Negocio

| Procedimiento | Inputs clave | Dependencias/Validaciones | Resultado esperado |
|---------------|--------------|---------------------------|--------------------|
| `sp_crear_presupuesto_completo` | usuario, nombre, descripción, `anio/mes` inicio-fin, `p_lista_subcategorias_json`, creado_por | 1) validar solapamiento de presupuestos activos del usuario; 2) validar periodo (inicio<=fin); 3) asegurarse que todas las subcategorías existan y pertenezcan al usuario. | Crea registro en `PRESUPUESTO` + múltiples filas en `DETALLE_PRESUPUESTO` en una única transacción; retorna ID y número de detalles. |
| `sp_registrar_transaccion_completa` | usuario, presupuesto, año, mes, subcategoría, tipo, monto, fecha, método pago | 1) `fn_validar_vigencia_presupuesto`; 2) tipo debe coincidir con el de la categoría; 3) si incluye obligación, validar que pertenece al usuario y subcategoría; 4) impedir montos negativos según tipo. | Inserta en `TRANSACCIONES`, retorna ID y mensaje; puede disparar alertas (opcional). |
| `sp_procesar_obligaciones_mes` | usuario, año, mes, presupuesto | 1) Buscar `OBLIGACION_FIJA` activas cuyo `dia_mes_expiracion` caiga en el mes solicitado; 2) validar que cada obligación tenga detalle/subcategoría mapeada al presupuesto. | Devuelve conjunto de obligaciones a vencer y opcionalmente crea registros en una tabla de alertas o transacciones preprogramadas. |
| `sp_calcular_balance_mensual` | usuario, presupuesto, año, mes | Usa `TRANSACCIONES` agrupadas por `tipo` (ingreso/gasto/ahorro). | Retorna parámetros de salida `p_total_ingresos`, `p_total_gastos`, `p_total_ahorros`, `p_balance_final`. |
| `sp_calcular_monto_ejecutado_mes` | subcategoría, presupuesto, año, mes | Usa `TRANSACCIONES` filtrando subcategoría/presupuesto/año/mes y el tipo correcto (derivado de categoría). | Retorna `p_monto_ejecutado NUMERIC(15,2)`.
| `sp_calcular_porcentaje_ejecucion_mes` | subcategoría, presupuesto, año, mes | Depende de `sp_calcular_monto_ejecutado_mes` y `DETALLE_PRESUPUESTO.monto_mensual`; manejar división por cero. | Retorna porcentaje `NUMERIC(9,4)` y estatus (ej. ok/sobrepasado). |
| `sp_cerrar_presupuesto` | presupuesto, modificado_por | 1) Validar fecha actual >= fin; 2) verificar que no esté ya cerrado; 3) generar snapshot de totales (puede usar `sp_calcular_balance_mensual`). | Marca estado `cerrado`, registra `modificado_en`, retorna resumen (ingresos/gastos/ahorros/balance). |
| `sp_obtener_resumen_categoria_mes` | categoría, presupuesto, año, mes | Requiere mapear subcategorías de la categoría al presupuesto. | Retorna monto presupuestado mensual (suma detalles), monto ejecutado (suma transacciones) y porcentaje calculado.

### 4. Funciones Requeridas

1. `fn_calcular_monto_ejecutado(id_subcategoria, anio, mes)` → SUM `TRANSACCIONES.monto` filtrando `tipo` correcto.
2. `fn_calcular_porcentaje_ejecutado(id_subcategoria, id_presupuesto, anio, mes)` → usa función 1 + monto mensual de detalle.
3. `fn_obtener_balance_subcategoria(id_presupuesto, id_subcategoria, anio, mes)` → `monto_presupuestado - fn_calcular_monto_ejecutado`.
4. `fn_obtener_total_categoria_mes(id_categoria, id_presupuesto, anio, mes)` → suma `DETALLE_PRESUPUESTO.monto_mensual` para subcategorías de la categoría y periodo.
5. `fn_obtener_total_ejecutado_categoria_mes(id_categoria, anio, mes)` → suma transacciones de subcategorías de la categoría.
6. `fn_dias_hasta_vencimiento(id_obligacion)` → `DATEDIFF(DAY, CURRENT_DATE, fecha_proximo_vencimiento)` calculado con `dia_mes_expiracion` + mes actual.
7. `fn_validar_vigencia_presupuesto(fecha, id_presupuesto)` → retorna 1/0 ó lanza excepción si la fecha cae fuera de `[anio_inicio/mes_inicio, anio_fin/mes_fin]`.
8. `fn_obtener_categoria_por_subcategoria(id_subcategoria)` → SELECT directo en SUBCATEGORIA.
9. `fn_calcular_proyeccion_gasto_mensual(id_subcategoria, anio, mes)` → usa gasto ejecutado hasta la fecha y proyecta con `EXTRACT(DAY FROM CURRENT_DATE)` / días del mes.
10. `fn_obtener_promedio_gasto_subcategoria(id_usuario, id_subcategoria, cantidad_meses)` → promedio de SUM(monto) agrupado por mes sobre ventana móvil.

### 5. Orden de Ejecución Propuesto
1. Crear las funciones de soporte (`fn_validar_vigencia_presupuesto`, `fn_obtener_categoria_por_subcategoria`, `fn_calcular_monto_ejecutado`).
2. Implementar funciones analíticas restantes (balance, porcentajes, proyecciones) reutilizando las anteriores.
3. Construir SP de métricas (`sp_calcular_monto_ejecutado_mes`, `sp_calcular_porcentaje_ejecucion_mes`, `sp_obtener_resumen_categoria_mes`).
4. Desarrollar SP transaccionales complejos (`sp_crear_presupuesto_completo`, `sp_registrar_transaccion_completa`, `sp_cerrar_presupuesto`, `sp_procesar_obligaciones_mes`).
5. Documentar ejemplos de uso y preparar scripts de prueba.

### 6. Riesgos y Consideraciones
- Firebird 5 no soporta JSON nativo en PSQL; si `p_lista_subcategorias_json` no puede procesarse en el motor, se considerará: (a) pasar texto y parsear con funciones externas, o (b) manejar el JSON en la API y llamar repetidamente al SP de inserción. Requiere confirmación.
- Volumen de transacciones puede demandar índices adicionales (`TRANSACCIONES (presupuesto_id, anio, mes, subcategoria_id)` y `DETALLE_PRESUPUESTO (presupuesto_id, subcategoria_id)`).
- Procedimientos de resumen podrían crearse como vistas materializadas si el rendimiento se vuelve crítico.

Este plan guía la construcción incremental de toda la capa de negocio para presupuestos y detalles, garantizando compatibilidad con las reglas descritas en `Definicion_Proyecto_Sistema_Presupuesto_Personal_Draft1.md` y con los SP/DTO existentes.
