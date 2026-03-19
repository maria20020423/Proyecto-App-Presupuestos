CREATE PROCEDURE SP_CALCULAR_MONTO_EJECUTADO_MES (
    p_id_subcategoria INTEGER,
    p_id_presupuesto INTEGER,
    p_anio INTEGER,
    p_mes INTEGER
)
RETURNS (
    monto_ejecutado NUMERIC(15, 2)
)
AS
BEGIN
    monto_ejecutado = FN_CALCULAR_MONTO_EJECUTADO(:p_id_subcategoria, :p_id_presupuesto, :p_anio, :p_mes);
    SUSPEND;
END#
