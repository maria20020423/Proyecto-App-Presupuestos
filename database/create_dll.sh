#!/bin/bash

BASE_DIR=$(dirname "$(readlink -f "$0")")

DIR_TABLAS="$BASE_DIR/tablas"
DIR_PROCEDIMIENTOS="$BASE_DIR/procedimientos"
ARCHIVO_DESTINO="$BASE_DIR/DLL/crear_base_datos.sql"

mkdir -p "$(dirname "$ARCHIVO_DESTINO")"

# Limpiar archivo destino
> "$ARCHIVO_DESTINO"

# Agregar encabezado requerido
echo "SET TERM #;" >> "$ARCHIVO_DESTINO"
echo "" >> "$ARCHIVO_DESTINO"


if ls "$DIR_TABLAS"/*.sql >/dev/null 2>&1; then
    for file in "$DIR_TABLAS"/*.sql; do
        cat "$file" >> "$ARCHIVO_DESTINO"
        echo -e "\n" >> "$ARCHIVO_DESTINO"
    done
    echo "Tablas agregadas desde: $DIR_TABLAS"
else
    echo "Advertencia: No se encontraron archivos .sql en '$DIR_TABLAS'"
fi

if [ -d "$DIR_PROCEDIMIENTOS" ]; then
    for entidad_dir in "$DIR_PROCEDIMIENTOS"/*; do
        if [ -d "$entidad_dir" ]; then
            for file in "$entidad_dir"/*.sql; do
                [ -f "$file" ] || continue
                cat "$file" >> "$ARCHIVO_DESTINO"
                echo -e "\n" >> "$ARCHIVO_DESTINO"
            done
        fi
    done
    echo "Procedimientos agregados desde: $DIR_PROCEDIMIENTOS"
else
    echo "Advertencia: No existe el directorio '$DIR_PROCEDIMIENTOS'"
fi

echo "SET TERM ;#" >> "$ARCHIVO_DESTINO"

echo "Archivo generado en: $ARCHIVO_DESTINO"