CREATE EXCEPTION EX_CATEGORIA_CON_SUBCATEGORIAS 'La categoria tiene subcategorias activas adicionales';
CREATE EXCEPTION EX_CATEGORIA_NO_DEFAULT 'No existe subcategoria por defecto';
CREATE EXCEPTION EX_CATEGORIA_NO_ENCONTRADA 'Categoria no encontrada';
CREATE EXCEPTION EX_SUBCATEGORIA_DEFAULT_EXISTENTE 'Ya existe una subcategoria por defecto';
CREATE EXCEPTION EX_CATEGORIA_SIN_SUBCATEGORIA 'La categoria debe mantener al menos una subcategoria activa';
CREATE EXCEPTION EX_SUBCATEGORIA_NO_ENCONTRADA 'Subcategoria no encontrada';
CREATE EXCEPTION EX_SUBCATEGORIA_DEFAULT_NO_ELIMINAR 'No se puede eliminar la subcategoria por defecto';
CREATE EXCEPTION EX_SUBCATEGORIA_USADA_DETALLE 'La subcategoria se utiliza en detalle de presupuesto';
CREATE EXCEPTION EX_SUBCATEGORIA_USADA_TRANSACCION 'La subcategoria se utiliza en transacciones';
