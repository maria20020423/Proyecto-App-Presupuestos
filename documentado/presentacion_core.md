# 📊 Presentación Core - Sistema de Presupuesto Personal

## 1. Descripción General del Sistema

**Aplicación de Presupuesto Personal** - Sistema completo para gestión financiera personal con:
- Gestión de usuarios y perfiles
- Categorización de ingresos, gastos y ahorros
- Creación y seguimiento de presupuestos mensuales
- Registro de transacciones
- Metas de ahorro
- Obligaciones fijas (recurrentes)

---

## 2. Entidades del Sistema (Tablas)

### 2.1 USUARIO 👤
**Descripción:** Entidad principal que representa a los usuarios del sistema.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id_usuario | INTEGER (PK) | Identificador único del usuario |
| nombre | VARCHAR(255) | Nombre del usuario |
| apellido | VARCHAR(255) | Apellido del usuario |
| correo_electronico | VARCHAR(255) | Email único del usuario |
| salario_mensual_base | NUMERIC(15,2) | Salario base mensual |
| estado | VARCHAR(20) | Estado: 'activo' o 'inactivo' |
| creado_en | TIMESTAMP | Fecha de creación del registro |
| modificado_en | TIMESTAMP | Fecha de última modificación |
| creador_por | INTEGER | Usuario que creó el registro |
| modificado_por | INTEGER | Usuario que modificó el registro |

---

### 2.2 CATEGORIA 🏷️
**Descripción:** Clasificación de transacciones en tipos (ingreso, gasto, ahorro).

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | INTEGER (PK) | Identificador único de la categoría |
| nombre | VARCHAR(500) | Nombre de la categoría |
| descripcion | VARCHAR(500) | Descripción detallada |
| tipo_categoria | VARCHAR(20) | Tipo: 'ingreso', 'gasto', 'ahorro' |
| category_icon | VARCHAR(150) | Icono asociado a la categoría |
| color_format | VARCHAR(10) | Color para UI |
| ui_order | INTEGER | Orden de visualización |
| id_usuario | INTEGER (FK) | Usuario propietario |
| estado | VARCHAR(20) | Estado: 'activa' o 'inactiva' |

**Relaciones:**
- `id_usuario` → **USUARIO(id_usuario)** (CASCADE DELETE/UPDATE)

---

### 2.3 SUBCATEGORIA 📂
**Descripción:** Subdivisión de categorías para clasificación más granular.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | INTEGER (PK) | Identificador único |
| categoria_id | INTEGER (FK) | Categoría padre |
| nombre | VARCHAR(500) | Nombre de la subcategoría |
| descripcion | VARCHAR(500) | Descripción |
| is_default | BOOLEAN | Es subcategoría por defecto |
| estado | VARCHAR(20) | Estado: 'activa' o 'inactiva' |

**Relaciones:**
- `categoria_id` → **CATEGORIA(id)** (CASCADE DELETE/UPDATE)

---

### 2.4 PRESUPUESTO 💰
**Descripción:** Planificación financiera mensual/anual del usuario.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id_presupuesto | INTEGER (PK) | Identificador único |
| id_usuario | INTEGER (FK) | Usuario propietario |
| nombre_presupuesto | VARCHAR(255) | Nombre del presupuesto |
| anio_inicio | INTEGER | Año de inicio |
| mes_inicio | INTEGER | Mes de inicio (1-12) |
| anio_fin | INTEGER | Año de fin |
| mes_fin | INTEGER | Mes de fin (1-12) |
| total_ingresos_planificados | NUMERIC(15,2) | Total ingresos planificados |
| total_gastos_planificados | NUMERIC(15,2) | Total gastos planificados |
| total_ahorro_planificado | NUMERIC(15,2) | Total ahorro planificado |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| estado | VARCHAR(20) | Estado: 'borrador', 'activo', 'cerrado' |

**Relaciones:**
- `id_usuario` → **USUARIO(id_usuario)** (CASCADE DELETE/UPDATE)

---

### 2.5 DETALLE_PRESUPUESTO 📋
**Descripción:** Items específicos dentro de un presupuesto.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | INTEGER (PK) | Identificador único |
| presupuesto_id | INTEGER (FK) | Presupuesto asociado |
| subcategoria_id | INTEGER (FK) | Subcategoría asociada |
| observaciones | VARCHAR(500) | Notas adicionales |
| monto_mensual | NUMERIC(15,2) | Monto planificado mensual |
| estado | VARCHAR(20) | Estado del detalle |

**Relaciones:**
- `presupuesto_id` → **PRESUPUESTO(id_presupuesto)** (CASCADE DELETE/UPDATE)
- `subcategoria_id` → **SUBCATEGORIA(id)** (CASCADE DELETE/UPDATE)

---

### 2.6 META_AHORRO 🎯
**Descripción:** Objetivos de ahorro definidos por el usuario.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | INTEGER (PK) | Identificador único |
| id_usuario | INTEGER (FK) | Usuario propietario |
| nombre | VARCHAR(255) | Nombre de la meta |
| descripcion | VARCHAR(500) | Descripción de la meta |
| monto_objetivo | NUMERIC(15,2) | Monto a alcanzar |
| monto_acumulado | NUMERIC(15,2) | Monto actualmente ahorrado |
| fecha_objetivo | DATE | Fecha límite para alcanzar la meta |
| estado | VARCHAR(20) | Estado de la meta |
| prioridad | INTEGER | Prioridad (1-5) |
| promedio_ahorro_mensual | NUMERIC(15,2) | Promedio mensual de ahorro |
| fecha_inicio | DATE | Fecha de inicio |
| fecha_completada | DATE | Fecha de completitud |

**Relaciones:**
- `id_usuario` → **USUARIO(id_usuario)** (CASCADE DELETE/UPDATE)

---

### 2.7 OBLIGACION_FIJA 📅
**Descripción:** Pagos recurrentes mensuales (facturas, suscripciones, etc.).

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | INTEGER (PK) | Identificador único |
| id_usuario | INTEGER (FK) | Usuario propietario |
| subcategoria_id | INTEGER (FK) | Subcategoría de gasto |
| nombre | VARCHAR(500) | Nombre de la obligación |
| descripcion | VARCHAR(500) | Descripción |
| monto | NUMERIC(15,2) | Monto mensual |
| dia_mes_expiracion | INTEGER | Día del mes de vencimiento |
| is_vigente | BOOLEAN | Está vigente |
| fecha_inicio | DATE | Fecha de inicio |
| fecha_final | DATE | Fecha de finalización |

**Relaciones:**
- `id_usuario` → **USUARIO(id_usuario)** (CASCADE DELETE/UPDATE)
- `subcategoria_id` → **SUBCATEGORIA(id)** (CASCADE DELETE/UPDATE)

---

### 2.8 TRANSACCIONES 💸
**Descripción:** Registro de todos los movimientos financieros.

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| id | INTEGER (PK) | Identificador único |
| id_usuario | INTEGER (FK) | Usuario que realiza la transacción |
| presupuesto_id | INTEGER (FK) | Presupuesto asociado |
| anio | INTEGER | Año de la transacción |
| mes | INTEGER | Mes de la transacción |
| subcategoria_id | INTEGER (FK) | Subcategoría de la transacción |
| obligacion_id | INTEGER (FK) | Obligación fija asociada (opcional) |
| tipo | VARCHAR(20) | Tipo: 'ingreso', 'gasto', 'ahorro' |
| descripcion | VARCHAR(500) | Descripción de la transacción |
| monto | NUMERIC(15,2) | Monto de la transacción |
| fecha | DATE | Fecha de la transacción |
| metodo_pago | VARCHAR(30) | Método de pago utilizado |
| no_factura | VARCHAR(500) | Número de factura/recibo |
| observaciones | VARCHAR(500) | Notas adicionales |
| estado | VARCHAR(20) | Estado: 'activo' o 'inactivo' |

**Relaciones:**
- `id_usuario` → **USUARIO(id_usuario)** (CASCADE DELETE/UPDATE)
- `presupuesto_id` → **PRESUPUESTO(id_presupuesto)** (CASCADE DELETE/UPDATE)
- `subcategoria_id` → **SUBCATEGORIA(id)** (CASCADE DELETE/UPDATE)
- `obligacion_id` → **OBLIGACION_FIJA(id)** (SET NULL ON DELETE)

---

## 3. Diagrama de Relaciones (Resumen)

```
USUARIO (1)
    ├──► CATEGORIA (N)
    │       └──► SUBCATEGORIA (N)
    │               └──► OBLIGACION_FIJA (N)
    │               └──► DETALLE_PRESUPUESTO (N)
    │               └──► TRANSACCIONES (N)
    ├──► PRESUPUESTO (N)
    │       └──► DETALLE_PRESUPUESTO (N)
    │       └──► TRANSACCIONES (N)
    ├──► META_AHORRO (N)
    └──► TRANSACCIONES (N)
```

---

## 4. Procedimientos Almacenados por Entidad

---

### 4.1 USUARIO 👤

#### SP_INSERTAR_USUARIO
**Descripción:** Crea un nuevo usuario en el sistema.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_nombre | VARCHAR(255) | Nombre del usuario |
| p_apellido | VARCHAR(255) | Apellido del usuario |
| p_email | VARCHAR(255) | Correo electrónico |
| p_salario_mensual | NUMERIC(15,2) | Salario mensual base |

**Retorna:** `id_usuario` (INTEGER)

---

#### SP_ACTUALIZAR_USUARIO
**Descripción:** Actualiza datos de un usuario existente.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | ID del usuario a actualizar |
| p_nombre | VARCHAR(255) | Nuevo nombre |
| p_apellido | VARCHAR(255) | Nuevo apellido |
| p_salario_mensual | NUMERIC(15,2) | Nuevo salario |

---

#### SP_ELIMINAR_USUARIO
**Descripción:** Desactiva un usuario (eliminación lógica).

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | ID del usuario a desactivar |

---

#### SP_LISTAR_USUARIOS
**Descripción:** Lista todos los usuarios activos.

**Retorna:** id_usuario, nombre, apellido, correo_electronico, salario_mensual_base, estado

---

#### SP_CONSULTAR_USUARIO
**Descripción:** Obtiene datos de un usuario específico.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | ID del usuario a consultar |

**Retorna:** Datos completos del usuario

---

#### SP_LOGIN_USUARIO
**Descripción:** Valida credenciales de usuario.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_correo_electronico | VARCHAR(255) | Email del usuario |

**Retorna:** Datos del usuario si existe

---

### 4.2 CATEGORIA 🏷️

#### SP_INSERTAR_CATEGORIA
**Descripción:** Crea una nueva categoría.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario propietario |
| p_nombre | VARCHAR(500) | Nombre de la categoría |
| p_descripcion | VARCHAR(500) | Descripción |
| p_tipo_categoria | VARCHAR(20) | Tipo: ingreso/gasto/ahorro |
| p_category_icon | VARCHAR(150) | Icono |
| p_color_format | VARCHAR(10) | Color |
| p_ui_order | INTEGER | Orden de visualización |
| p_estado | VARCHAR(20) | Estado |
| p_creado_por | INTEGER | Creador |

**Retorna:** `id_categoria` (INTEGER)

---

#### SP_LISTAR_CATEGORIAS
**Descripción:** Lista categorías de un usuario filtradas por tipo.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario propietario |
| p_tipo_categoria | VARCHAR(20) | Tipo a filtrar (opcional) |

**Retorna:** Datos completos de categorías

---

#### SP_CONSULTAR_CATEGORIA
**Descripción:** Obtiene datos de una categoría específica.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_categoria | INTEGER | ID de la categoría |

---

#### SP_ELIMINAR_CATEGORIA
**Descripción:** Desactiva categoría y sus subcategorías asociadas.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_categoria | INTEGER | ID de la categoría a desactivar |

---

### 4.3 SUBCATEGORIA 📂

#### SP_INSERTAR_SUBCATEGORIA
**Descripción:** Crea una nueva subcategoría.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_categoria_id | INTEGER | Categoría padre |
| p_nombre | VARCHAR(500) | Nombre |
| p_descripcion | VARCHAR(500) | Descripción |
| p_is_default | BOOLEAN | Es por defecto |
| p_estado | VARCHAR(20) | Estado |
| p_creado_por | INTEGER | Creador |

**Retorna:** id_subcategoria

---

#### SP_LISTAR_SUBCATEGORIAS
**Descripción:** Lista subcategorías filtradas.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_categoria_id | INTEGER | ID de categoría (opcional) |
| p_id_usuario | INTEGER | ID de usuario |

---

#### SP_CONSULTAR_SUBCATEGORIA
**Descripción:** Obtiene datos de una subcategoría.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_subcategoria | INTEGER | ID de la subcategoría |

---

#### SP_ACTUALIZAR_SUBCATEGORIA
**Descripción:** Actualiza datos de una subcategoría.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id | INTEGER | ID de la subcategoría |
| p_nombre | VARCHAR(500) | Nuevo nombre |
| p_descripcion | VARCHAR(500) | Nueva descripción |
| p_is_default | BOOLEAN | Nuevo valor default |
| p_estado | VARCHAR(20) | Nuevo estado |
| p_modificado_por | INTEGER | Modificador |

---

#### SP_ELIMINAR_SUBCATEGORIA
**Descripción:** Desactiva una subcategoría.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_subcategoria | INTEGER | ID a desactivar |

---

### 4.4 PRESUPUESTO 💰

#### SP_INSERTAR_PRESUPUESTO
**Descripción:** Crea un nuevo presupuesto con validación de traslapos.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_usuario | INTEGER | Usuario propietario |
| nombre_presupuesto | VARCHAR(255) | Nombre |
| anio_inicio | INTEGER | Año inicio |
| mes_inicio | INTEGER | Mes inicio |
| anio_fin | INTEGER | Año fin |
| mes_fin | INTEGER | Mes fin |
| total_ingresos_planificados | NUMERIC(15,2) | Ingresos planificados |
| total_gastos_planificados | NUMERIC(15,2) | Gastos planificados |
| total_ahorro_planificado | NUMERIC(15,2) | Ahorro planificado |
| fecha_creacion | TIMESTAMP | Fecha creación |
| estado | VARCHAR(20) | Estado |
| creado_en | TIMESTAMP | Timestamp creación |
| creado_por | INTEGER | Creador |

**Retorna:** `nuevo_id_presupuesto`

**Validaciones:**
- No permite traslapos con presupuestos activos del mismo usuario
- Lanza excepción `EX_PRESUPUESTO_TRASLAPADO` si hay conflicto

---

#### SP_LISTAR_PRESUPUESTOS
**Descripción:** Lista presupuestos de un usuario.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario propietario |
| p_estado | VARCHAR(20) | Estado a filtrar (opcional) |

---

#### SP_CONSULTAR_PRESUPUESTO
**Descripción:** Obtiene datos de un presupuesto específico.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_presupuesto | INTEGER | ID del presupuesto |

---

#### SP_ACTUALIZAR_PRESUPUESTO
**Descripción:** Actualiza datos de un presupuesto.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_presupuesto | INTEGER | ID a actualizar |
| p_nombre_presupuesto | VARCHAR(255) | Nuevo nombre |
| p_total_ingresos_planificados | NUMERIC(15,2) | Nuevos ingresos |
| p_total_gastos_planificados | NUMERIC(15,2) | Nuevos gastos |
| p_total_ahorro_planificado | NUMERIC(15,2) | Nuevo ahorro |
| p_modificado_por | INTEGER | Modificador |

---

#### SP_ELIMINAR_PRESUPUESTO
**Descripción:** Elimina un presupuesto.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_presupuesto | INTEGER | ID a eliminar |

---

#### SP_CALCULAR_BALANCE_MENSUAL
**Descripción:** Calcula el balance mensual de un presupuesto.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario |
| p_id_presupuesto | INTEGER | Presupuesto |
| p_anio | INTEGER | Año |
| p_mes | INTEGER | Mes |

**Retorna:** total_ingresos, total_gastos, total_ahorros, balance_final

---

#### SP_CERRAR_PRESUPUESTO
**Descripción:** Cierra un presupuesto y calcula totales finales.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_presupuesto | INTEGER | ID del presupuesto |
| p_modificado_por | INTEGER | Usuario que cierra |

**Retorna:** total_ingresos, total_gastos, total_ahorros, balance_final

**Validaciones:**
- Solo permite cerrar si está en fecha fin o después
- Lanza excepciones si no existe o ya está cerrado

---

#### SP_CREAR_PRESUPUESTO_COMPLETO
**Descripción:** Crea presupuesto con detalles incluidos (JSON).

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario propietario |
| p_nombre | VARCHAR(255) | Nombre |
| p_descripcion | VARCHAR(500) | Descripción |
| p_detalles_presupuesto | BLOB | Detalles en formato JSON |
| p_anio_inicio | INTEGER | Año inicio |
| p_mes_inicio | INTEGER | Mes inicio |
| p_anio_fin | INTEGER | Año fin |
| p_mes_fin | INTEGER | Mes fin |
| p_total_ingresos | NUMERIC(15,2) | Ingresos |
| p_total_gastos | NUMERIC(15,2) | Gastos |
| p_total_ahorro | NUMERIC(15,2) | Ahorro |
| p_creado_por | INTEGER | Creador |

---

### 4.5 DETALLE_PRESUPUESTO 📋

#### SP_INSERTAR_DETALLE_PRESUPUESTO
**Descripción:** Agrega un item al presupuesto.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_presupuesto_id | INTEGER | Presupuesto |
| p_subcategoria_id | INTEGER | Subcategoría |
| p_observaciones | VARCHAR(500) | Notas |
| p_monto_mensual | NUMERIC(15,2) | Monto mensual |
| p_estado | VARCHAR(20) | Estado |
| p_creado_por | INTEGER | Creador |

---

#### SP_LISTAR_DETALLE_PRESUPUESTO
**Descripción:** Lista detalles de un presupuesto.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_presupuesto_id | INTEGER | ID del presupuesto |

---

#### SP_CONSULTAR_DETALLE_PRESUPUESTO
**Descripción:** Obtiene un detalle específico.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_detalle | INTEGER | ID del detalle |

---

#### SP_ACTUALIZAR_DETALLE_PRESUPUESTO
**Descripción:** Actualiza un detalle.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id | INTEGER | ID del detalle |
| p_monto_mensual | NUMERIC(15,2) | Nuevo monto |
| p_observaciones | VARCHAR(500) | Nuevas observaciones |
| p_estado | VARCHAR(20) | Nuevo estado |
| p_modificado_por | INTEGER | Modificador |

---

#### SP_ELIMINAR_DETALLE_PRESUPUESTO
**Descripción:** Elimina un detalle.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_detalle | INTEGER | ID a eliminar |

---

### 4.6 META_AHORRO 🎯

#### SP_INSERTAR_META_AHORRO
**Descripción:** Crea una nueva meta de ahorro.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario propietario |
| p_nombre | VARCHAR(255) | Nombre de la meta |
| p_descripcion | VARCHAR(500) | Descripción |
| p_monto_objetivo | NUMERIC(15,2) | Monto objetivo |
| p_monto_acumulado | NUMERIC(15,2) | Monto inicial acumulado |
| p_fecha_objetivo | DATE | Fecha límite |
| p_estado | VARCHAR(20) | Estado |
| p_prioridad | INTEGER | Prioridad (1-5) |
| p_promedio_ahorro_mensual | NUMERIC(15,2) | Promedio mensual |
| p_fecha_inicio | DATE | Fecha inicio |
| p_fecha_completada | DATE | Fecha completada |
| p_creado_por | INTEGER | Creador |

**Retorna:** `id_meta_ahorro`

---

#### SP_LISTAR_METAS_AHORRO
**Descripción:** Lista metas de ahorro de un usuario.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario propietario |
| p_estado | VARCHAR(20) | Estado a filtrar (opcional) |

---

#### SP_CONSULTAR_META_AHORRO
**Descripción:** Obtiene datos de una meta específica.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_meta | INTEGER | ID de la meta |

---

#### SP_ACTUALIZAR_META_AHORRO
**Descripción:** Actualiza una meta de ahorro.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id | INTEGER | ID de la meta |
| p_nombre | VARCHAR(255) | Nuevo nombre |
| p_descripcion | VARCHAR(500) | Nueva descripción |
| p_monto_objetivo | NUMERIC(15,2) | Nuevo monto objetivo |
| p_monto_acumulado | NUMERIC(15,2) | Nuevo monto acumulado |
| p_fecha_objetivo | DATE | Nueva fecha objetivo |
| p_estado | VARCHAR(20) | Nuevo estado |
| p_prioridad | INTEGER | Nueva prioridad |
| p_promedio_ahorro_mensual | NUMERIC(15,2) | Nuevo promedio |
| p_fecha_inicio | DATE | Nueva fecha inicio |
| p_fecha_completada | DATE | Nueva fecha completada |
| p_modificado_por | INTEGER | Modificador |

---

#### SP_ELIMINAR_META_AHORRO
**Descripción:** Elimina una meta de ahorro.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_meta | INTEGER | ID a eliminar |

---

### 4.7 OBLIGACION_FIJA 📅

#### SP_INSERTAR_OBLIGACION_FIJA
**Descripción:** Crea una obligación de pago recurrente.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario propietario |
| p_subcategoria_id | INTEGER | Subcategoría de gasto |
| p_nombre | VARCHAR(500) | Nombre de la obligación |
| p_descripcion | VARCHAR(500) | Descripción |
| p_dia_mes_expiracion | INTEGER | Día de vencimiento |
| p_monto | NUMERIC(15,2) | Monto mensual |
| p_is_vigente | BOOLEAN | Está vigente |
| p_fecha_inicio | DATE | Fecha de inicio |
| p_fecha_final | DATE | Fecha de finalización |
| p_creado_por | INTEGER | Creador |

**Retorna:** `id_obligacion_fija`

**Validaciones:**
- Verifica que la subcategoría sea de tipo 'gasto'
- Lanza `EX_OBLIGACION_SUBCATEGORIA_TIPO_INVALIDO` si no es gasto
- Verifica que fecha_final > fecha_inicio
- Lanza `EX_OBLIGACION_FECHA_FINAL_INVALIDA` si la fecha es inválida

---

#### SP_LISTAR_OBLIGACIONES_FIJAS
**Descripción:** Lista obligaciones fijas de un usuario.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario propietario |
| p_is_vigente | BOOLEAN | Filtrar por vigencia (opcional) |

---

#### SP_CONSULTAR_OBLIGACION_FIJA
**Descripción:** Obtiene datos de una obligación específica.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_obligacion | INTEGER | ID de la obligación |

---

#### SP_ACTUALIZAR_OBLIGACION_FIJA
**Descripción:** Actualiza una obligación fija.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id | INTEGER | ID de la obligación |
| p_subcategoria_id | INTEGER | Nueva subcategoría |
| p_nombre | VARCHAR(500) | Nuevo nombre |
| p_descripcion | VARCHAR(500) | Nueva descripción |
| p_dia_mes_expiracion | INTEGER | Nuevo día de vencimiento |
| p_monto | NUMERIC(15,2) | Nuevo monto |
| p_is_vigente | BOOLEAN | Nueva vigencia |
| p_fecha_inicio | DATE | Nueva fecha inicio |
| p_fecha_final | DATE | Nueva fecha final |
| p_modificado_por | INTEGER | Modificador |

---

#### SP_ELIMINAR_OBLIGACION_FIJA
**Descripción:** Elimina una obligación fija.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_obligacion | INTEGER | ID a eliminar |

---

### 4.8 TRANSACCIONES 💸

#### SP_INSERTAR_TRANSACCIONES
**Descripción:** Registra una nueva transacción.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario que realiza la transacción |
| p_presupuesto_id | INTEGER | Presupuesto asociado |
| p_anio | INTEGER | Año de la transacción |
| p_mes | INTEGER | Mes de la transacción |
| p_subcategoria_id | INTEGER | Subcategoría |
| p_obligacion_id | INTEGER | Obligación fija (opcional) |
| p_tipo | VARCHAR(20) | Tipo: ingreso/gasto/ahorro |
| p_descripcion | VARCHAR(500) | Descripción |
| p_monto | NUMERIC(15,2) | Monto |
| p_fecha | DATE | Fecha de la transacción |
| p_metodo_pago | VARCHAR(30) | Método de pago |
| p_no_factura | VARCHAR(500) | Número de factura |
| p_observaciones | VARCHAR(500) | Notas |
| p_creado_por | INTEGER | Creador |

**Retorna:** `id_transacciones`

---

#### SP_LISTAR_TRANSACCIONES
**Descripción:** Lista transacciones con filtros.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario propietario |
| p_presupuesto_id | INTEGER | Presupuesto (opcional) |
| p_anio | INTEGER | Año (opcional) |
| p_mes | INTEGER | Mes (opcional) |
| p_tipo | VARCHAR(20) | Tipo (opcional) |

---

#### SP_CONSULTAR_TRANSACCION
**Descripción:** Obtiene datos de una transacción específica.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_transaccion | INTEGER | ID de la transacción |

---

#### SP_ACTUALIZAR_TRANSACCIONES
**Descripción:** Actualiza una transacción.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id | INTEGER | ID de la transacción |
| p_presupuesto_id | INTEGER | Nuevo presupuesto |
| p_anio | INTEGER | Nuevo año |
| p_mes | INTEGER | Nuevo mes |
| p_subcategoria_id | INTEGER | Nueva subcategoría |
| p_obligacion_id | INTEGER | Nueva obligación |
| p_tipo | VARCHAR(20) | Nuevo tipo |
| p_descripcion | VARCHAR(500) | Nueva descripción |
| p_monto | NUMERIC(15,2) | Nuevo monto |
| p_fecha | DATE | Nueva fecha |
| p_metodo_pago | VARCHAR(30) | Nuevo método de pago |
| p_no_factura | VARCHAR(500) | Nueva factura |
| p_observaciones | VARCHAR(500) | Nuevas observaciones |
| p_modificado_por | INTEGER | Modificador |

---

#### SP_ELIMINAR_TRANSACCIONES
**Descripción:** Elimina una transacción (lógica).

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_transaccion | INTEGER | ID a eliminar |
| p_modificado_por | INTEGER | Usuario que elimina |

---

## 5. Procedimientos Especiales de Presupuesto

### SP_CALCULAR_MONTO_EJECUTADO_MES
Calcula el monto ejecutado en un mes específico.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_presupuesto_id | INTEGER | ID del presupuesto |
| p_anio | INTEGER | Año |
| p_mes | INTEGER | Mes |

---

### SP_CALCULAR_PORCENTAJE_EJECUCION_MES
Calcula el porcentaje de ejecución de un presupuesto en un mes.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_presupuesto_id | INTEGER | ID del presupuesto |
| p_anio | INTEGER | Año |
| p_mes | INTEGER | Mes |

---

### SP_CALCULAR_TOTALES_PRESUPUESTO_PERIODO
Calcula totales de ingresos, gastos y ahorros de un período.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_presupuesto_id | INTEGER | ID del presupuesto |

**Retorna:** Totales acumulados del período completo

---

### SP_OBTENER_RESUMEN_CATEGORIA_MES
Obtiene resumen de ejecución por categoría en un mes.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_presupuesto_id | INTEGER | ID del presupuesto |
| p_anio | INTEGER | Año |
| p_mes | INTEGER | Mes |

---

### SP_PROCESAR_OBLIGACIONES_MES
Procesa automáticamente las obligaciones fijas de un mes.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario |
| p_presupuesto_id | INTEGER | Presupuesto |
| p_anio | INTEGER | Año |
| p_mes | INTEGER | Mes |
| p_creado_por | INTEGER | Usuario que procesa |

---

### SP_REGISTRAR_TRANSACCION_COMPLETA
Registra transacción con validaciones completas de presupuesto.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| p_id_usuario | INTEGER | Usuario |
| p_presupuesto_id | INTEGER | Presupuesto |
| p_anio | INTEGER | Año |
| p_mes | INTEGER | Mes |
| p_subcategoria_id | INTEGER | Subcategoría |
| p_obligacion_id | INTEGER | Obligación fija |
| p_tipo | VARCHAR(20) | Tipo de transacción |
| p_descripcion | VARCHAR(500) | Descripción |
| p_monto | NUMERIC(15,2) | Monto |
| p_fecha | DATE | Fecha |
| p_metodo_pago | VARCHAR(30) | Método de pago |
| p_no_factura | VARCHAR(500) | Factura |
| p_observaciones | VARCHAR(500) | Notas |
| p_creado_por | INTEGER | Creador |

---

## 6. Resumen de Excepciones del Sistema

| Excepción | Descripción |
|-----------|-------------|
| EX_PRESUPUESTO_TRASLAPADO | Ya existe un presupuesto activo en el período |
| EX_PRESUPUESTO_FUERA_VIGENCIA | El período consultado está fuera de vigencia |
| EX_PRESUPUESTO_NO_ENCONTRADO | Presupuesto no existe o no está activo |
| EX_PRESUPUESTO_ESTADO | El presupuesto ya está cerrado |
| EX_PRESUPUESTO_NO_FINALIZADO | No se puede cerrar antes de la fecha fin |
| EX_OBLIGACION_SUBCATEGORIA_TIPO_INVALIDO | La subcategoría no es de tipo gasto |
| EX_OBLIGACION_FECHA_FINAL_INVALIDA | La fecha final debe ser posterior a la inicial |
| ex_categoria_con_subcategorias | No se puede eliminar categoría con subcategorías activas |

---

## 7. Arquitectura del Sistema

### Backend
- **Base de Datos:** Firebird SQL
- **API:** TypeScript/Node.js
- **Procedimientos:** 47+ stored procedures
- **Middleware:** Autenticación y validación

### Frontend
- **Framework:** React/Next.js
- **Estilos:** Tailwind CSS
- **UI Components:** shadcn/ui

### Infraestructura
- **Contenedores:** Docker + Docker Compose
- **Deploy:** Netlify (frontend)

---

*Documento generado para presentación del Sistema de Presupuesto Personal*
*Fecha de generación: Marzo 2026*
