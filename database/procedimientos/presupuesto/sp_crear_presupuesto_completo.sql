CREATE OR ALTER PROCEDURE SP_CREAR_PRESUPUESTO_COMPLETO (
    p_id_usuario INTEGER,
    p_nombre VARCHAR(255),
    p_descripcion VARCHAR(500),
    p_detalles_presupuesto BLOB SUB_TYPE TEXT CHARACTER SET UTF8,
    p_anio_inicio INTEGER,
    p_mes_inicio INTEGER,
    p_anio_fin INTEGER,
    p_mes_fin INTEGER,
    p_total_ingresos NUMERIC(15,2),
    p_total_gastos NUMERIC(15,2),
    p_total_ahorro NUMERIC(15,2),
    p_creado_por INTEGER
)
RETURNS (
    id_presupuesto INTEGER
)
AS

BEGIN
  --json BLOB no se puede iterar o manipular internamente solo es un datatype para almacenar datos complejos.
  --materail audifovisual, texto, docuemntos etc... pero no se puede manipular desde base datos, a no ser que se cuente con versiones como la de oracle.
  --oracle y otras disricuiones de firebird de pago contien funciones especiales para manejar y parsear, json 
  -- en la conferencia de berlin de 2019, el tipo json se  volvio uno de los tipos de datos mas pedidos.

    SUSPEND;
END;
