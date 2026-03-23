CREATE EXCEPTION EX_CATEGORIA_CON_SUBCATEGORIAS 'La categoria tiene subcategorias activas adicionales'#
CREATE EXCEPTION EX_CATEGORIA_NO_DEFAULT 'No existe subcategoria por defecto'#
CREATE EXCEPTION EX_CATEGORIA_NO_ENCONTRADA 'Categoria no encontrada'#
CREATE EXCEPTION EX_SUBCATEGORIA_DEFAULT_EXISTENTE 'Ya existe una subcategoria por defecto'#
CREATE EXCEPTION EX_CATEGORIA_SIN_SUBCATEGORIA 'La categoria debe mantener al menos una subcategoria activa'#
CREATE EXCEPTION EX_SUBCATEGORIA_NO_ENCONTRADA 'Subcategoria no encontrada'#
CREATE EXCEPTION EX_SUBCATEGORIA_DEFAULT_NO_ELIMINAR 'No se puede eliminar la subcategoria por defecto'#
CREATE EXCEPTION EX_SUBCATEGORIA_USADA_DETALLE 'La subcategoria se utiliza en detalle de presupuesto'#
CREATE EXCEPTION EX_SUBCATEGORIA_USADA_TRANSACCION 'La subcategoria se utiliza en transacciones'#
CREATE EXCEPTION EX_PRESUPUESTO_CON_TRANSACCIONES 'No se puede eliminar el presupuesto porque tiene transacciones asociadas'#
CREATE EXCEPTION EX_PRESUPUESTO_VIGENCIA 'Periodo de vigencia invalido para el presupuesto'#
CREATE EXCEPTION EX_PRESUPUESTO_TRASLAPADO 'Ya existe un presupuesto activo en el rango seleccionado'#
CREATE EXCEPTION EX_PRESUPUESTO_NO_ENCONTRADO 'Presupuesto no encontrado'#
CREATE EXCEPTION EX_PRESUPUESTO_USUARIO 'El presupuesto no pertenece al usuario indicado'#
CREATE EXCEPTION EX_PRESUPUESTO_ESTADO 'El presupuesto no se encuentra en estado activo'#
CREATE EXCEPTION EX_PRESUPUESTO_FUERA_VIGENCIA 'El periodo indicado esta fuera de la vigencia del presupuesto'#
CREATE EXCEPTION EX_PRESUPUESTO_NO_FINALIZADO 'El presupuesto aun no ha finalizado su vigencia'#
CREATE EXCEPTION EX_TRANSACCION_TIPO_INVALIDO 'Tipo de transaccion invalido'#
CREATE EXCEPTION EX_TRANSACCION_MONTO_INVALIDO 'El monto de la transaccion debe ser mayor que cero'#
CREATE EXCEPTION EX_TRANSACCION_MES_INVALIDO 'El mes indicado para la transaccion no es valido'#
CREATE EXCEPTION EX_TRANSACCION_CATEGORIA_INVALIDA 'La subcategoria no pertenece al usuario o su tipo no coincide'#
CREATE EXCEPTION EX_TRANSACCION_OBLIGACION_INVALIDA 'La obligacion indicada no es valida para la transaccion'#
CREATE EXCEPTION EX_TRANSACCION_FECHA_FUERA_RANGO 'La fecha de la transaccion cae fuera de la vigencia del presupuesto'#
CREATE EXCEPTION EX_OBLIGACION_NO_ENCONTRADA 'Obligacion fija no encontrada'#
CREATE EXCEPTION EX_OBLIGACION_SIN_DETALLE 'La obligacion no tiene detalle configurado en el presupuesto'#
CREATE EXCEPTION EX_OBLIGACION_SIN_SUBCATEGORIA 'Toda obligacion debe tener una subcategoria asociada'#
CREATE EXCEPTION EX_OBLIGACION_FECHA_FINAL_INVALIDA 'La fecha de finalizacion debe ser mayor que la fecha de inicio'#
CREATE EXCEPTION EX_OBLIGACION_SUBCATEGORIA_TIPO_INVALIDO 'Una obligacion fija solo puede estar asociada a subcategorias de categorias de tipo gasto'#