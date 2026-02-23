#!/bin/bash
BASE_DIR=$(dirname "$(readlink -f "$0")")
DIR_ORIGEN="$BASE_DIR/tablas"
ARCHIVO_DESTINO="$BASE_DIR/DLL/crear_base_datos.sql"
mkdir -p "$(dirname "$ARCHIVO_DESTINO")"

> "$ARCHIVO_DESTINO"

if ls "$DIR_ORIGEN"/*.sql >/dev/null 2>&1; then
    cat "$DIR_ORIGEN"/*.sql > "$ARCHIVO_DESTINO"
    echo "Origen: $DIR_ORIGEN"
    echo "Destino: $ARCHIVO_DESTINO"
else
    echo "Error: No se encontraron archivos .sql en '$DIR_ORIGEN'."
fi