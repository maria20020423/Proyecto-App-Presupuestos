CREATE TABLE "usuario" (
  "id_usuario" int PRIMARY KEY,
  "primer_nombre" varchar(50),
  "segundo_namobre" varchar(50),
  "primera_apellido" varchar(50),
  "segundo_apellido" varchar(50),
  "correo_electronico" varchar(100),
  "clave" varchar(225),
  "salaria_mensual" decimal(182),
  "estado_activo" boolean,
  "creado_por" int,
  "modificado_por" int,
  "creado_en" timestamp,
  "modificado_en" timestamp
);

CREATE TABLE "categoria" (
  "id_categoria" int PRIMARY KEY,
  "nombre_categoria" varchar(60),
  "descripcion_categoria" varchar(150),
  "tipo_categoria" varchar(20),
  "creado_por" int,
  "modificado_por" int,
  "creado_en" timestamp
);

CREATE TABLE "subcategoria" (
  "id_subcategoria" int PRIMARY KEY,
  "id_categoria" int,
  "nombre_subcategoria" varchar(60),
  "descripcion_subcategoria" varchar(150),
  "activa" boolen,
  "es_por_defecto" boolen,
  "creado_por" int,
  "modificado_por" int,
  "creado_en" timestamp,
  "modificado_en" timestamp
);

CREATE TABLE "prepuesto" (
  "id_presupuesto" int PRIMARY KEY,
  "id_usaurio" int,
  "nombre_presupuesto" varchar(120),
  "anio_inicio" int,
  "mes_inicio" int,
  "anio_fin" int,
  "mes_fin" int,
  "total_ingresos_planificados" decimal(182),
  "total_gasto_planificado" decimal(182),
  "tota_ahorro_planificado" decimal(182),
  "estado_presupuesto" varchar(20),
  "creado_por" int,
  "modificado_por" int,
  "creado_en" timestamp,
  "modificado_en" timestamp
);

CREATE TABLE "presupuesto_detalle" (
  "id_detalle" int PRIMARY KEY,
  "id_presupuesto" int,
  "id_subcategoria" int,
  "monto_mensual_asignado" decimal(182),
  "observacion" varchar(200),
  "creado_por" int,
  "modificado_por" int,
  "creado_en" timestamp,
  "modificado_en" timestamp
);

CREATE TABLE "obligacion_fija" (
  "id_obligacion" int PRIMARY KEY,
  "id_subcategoria" int,
  "nombre_obligacion" varchar(100),
  "descripcion_obligacion" varchar(200),
  "monto_fijo_mensual" decimal(18,2),
  "dia_vencimenta" int,
  "vigente" boolen,
  "feche_inicio" date,
  "fecha_fin" date,
  "creado_por" int,
  "modificado_por" int,
  "creado_en" timestamp,
  "modificado_en" timestamp
);

CREATE TABLE "transaccion" (
  "id_transaccion" int PRIMARY KEY,
  "id_detalle" int,
  "id_obligacion" int,
  "anio_transaccion" int,
  "mes_transaccion" int,
  "tipo_transaccion" varchar(20),
  "descripcion" varchar(200),
  "monto" decimal(18,2),
  "fecha_transaccion" date,
  "metodo_factura" varchar(40),
  "numero_factura" varchar(40),
  "observaciones" varchar(200),
  "registrado_en" timestamp,
  "creado_por" int,
  "modificado_por" int,
  "creado_en" timestamp,
  "modificado_en" timestamp
);

CREATE TABLE "obligacionfija_transaccion" (
  "id_obligacion" int,
  "id_transacion" int,
  "creado_por" int,
  "modificado_por" int,
  "creado_en" timestamp,
  "modificado_en" timestamp
);

ALTER TABLE "usuario" ADD FOREIGN KEY ("id_usuario") REFERENCES "prepuesto" ("id_usaurio") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "categoria" ADD FOREIGN KEY ("id_categoria") REFERENCES "subcategoria" ("id_categoria") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "obligacion_fija" ADD FOREIGN KEY ("id_subcategoria") REFERENCES "subcategoria" ("id_subcategoria") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "transaccion" ADD FOREIGN KEY ("id_transaccion") REFERENCES "obligacionfija_transaccion" ("id_transacion") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "presupuesto_detalle" ADD FOREIGN KEY ("id_subcategoria") REFERENCES "subcategoria" ("id_subcategoria") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "prepuesto" ADD FOREIGN KEY ("id_presupuesto") REFERENCES "presupuesto_detalle" ("id_presupuesto") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "presupuesto_detalle" ADD FOREIGN KEY ("id_detalle") REFERENCES "transaccion" ("id_detalle") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "obligacion_fija" ADD FOREIGN KEY ("id_obligacion") REFERENCES "obligacionfija_transaccion" ("id_obligacion") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "obligacion_fija" ADD FOREIGN KEY ("id_obligacion") REFERENCES "transaccion" ("id_obligacion") DEFERRABLE INITIALLY IMMEDIATE;
