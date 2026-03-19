CREATE PROCEDURE SP_CALCULAR_PORCENTAJE_EJECUCION_MES (
    p_id_subcategoria INTEGER,
    p_id_presupuesto INTEGER,
    p_anio INTEGER,
    p_mes INTEGER
)
RETURNS (
    porcentaje NUMERIC(9, 4)
)
AS
BEGIN
    porcentaje = FN_CALCULAR_PORCENTAJE_EJECUTADO(:p_id_subcategoria, :p_id_presupuesto, :p_anio, :p_mes);
    SUSPEND;
END#
