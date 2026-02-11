CREATE TABLE USUARIO (
    id_usuario INTEGER NOT NULL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    salario_mensual_base NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    CHECK (estado IN ('activo', 'inactivo')),
    CHECK (salario_mensual_base >= 0)
);

CREATE TABLE PRESUPUESTO (
    id_presupuesto INTEGER NOT NULL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    nombre_presupuesto VARCHAR(255) NOT NULL,
    anio_inicio INTEGER NOT NULL,
    mes_inicio INTEGER NOT NULL,
    anio_fin INTEGER NOT NULL,
    mes_fin INTEGER NOT NULL,
    total_ingresos_planificados NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    total_gastos_planificados NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    total_ahorro_planificado NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'borrador',
    CHECK (mes_inicio BETWEEN 1 AND 12),
    CHECK (mes_fin BETWEEN 1 AND 12),
    CHECK (estado IN ('activo', 'cerrado', 'borrador')),
    CHECK (total_ingresos_planificados >= 0 AND 
        total_gastos_planificados >= 0 AND 
        total_ahorro_planificado >= 0)
);

ALTER TABLE PRESUPUESTO 
ADD CONSTRAINT fk_PRESUPUESTO_id_usuario 
FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario);
