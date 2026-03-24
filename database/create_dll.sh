#!/bin/bash

BASE_DIR=$(dirname "$(readlink -f "$0")")

DIR_TABLAS="$BASE_DIR/tablas"
DIR_LLAVES_FORANEAS="$BASE_DIR/llaves_foraneas"
DIR_EXCEPTIONS="$BASE_DIR/exceptions"
DIR_FUNCIONES="$BASE_DIR/funciones"
DIR_PROCEDIMIENTOS="$BASE_DIR/procedimientos"
DIR_TRIGGERS="$BASE_DIR/triggers"
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

# Agregar llaves foraneas despues de tablas
if ls "$DIR_LLAVES_FORANEAS"/*.sql >/dev/null 2>&1; then
    for file in "$DIR_LLAVES_FORANEAS"/*.sql; do
        cat "$file" >> "$ARCHIVO_DESTINO"
        echo -e "\n" >> "$ARCHIVO_DESTINO"
    done
    echo "Llaves foraneas agregadas desde: $DIR_LLAVES_FORANEAS"
else
    echo "Advertencia: No se encontraron archivos .sql en '$DIR_LLAVES_FORANEAS'"
fi

# Agregar exceptions despues de llaves foraneas
if ls "$DIR_EXCEPTIONS"/*.sql >/dev/null 2>&1; then
    for file in "$DIR_EXCEPTIONS"/*.sql; do
        cat "$file" >> "$ARCHIVO_DESTINO"
        echo -e "\n" >> "$ARCHIVO_DESTINO"
    done
    echo "Exceptions agregadas desde: $DIR_EXCEPTIONS"
else
    echo "Advertencia: No se encontraron archivos .sql en '$DIR_EXCEPTIONS'"
fi

if [ -d "$DIR_FUNCIONES" ]; then
    for entidad_dir in "$DIR_FUNCIONES"/*; do
        if [ -d "$entidad_dir" ]; then
            for file in "$entidad_dir"/*.sql; do
                [ -f "$file" ] || continue
                cat "$file" >> "$ARCHIVO_DESTINO"
                echo -e "\n" >> "$ARCHIVO_DESTINO"
            done
        fi
    done
    echo "Funciones agregadas desde: $DIR_FUNCIONES"
else
    echo "Advertencia: No existe el directorio '$DIR_FUNCIONES'"
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

# Agregar triggers al final
if [ -d "$DIR_TRIGGERS" ]; then
    for entidad_dir in "$DIR_TRIGGERS"/*; do
        if [ -d "$entidad_dir" ]; then
            for file in "$entidad_dir"/*.sql; do
                [ -f "$file" ] || continue
                cat "$file" >> "$ARCHIVO_DESTINO"
                echo -e "\n" >> "$ARCHIVO_DESTINO"
            done
        fi
    done
    echo "Triggers agregados desde: $DIR_TRIGGERS"
else
    echo "Advertencia: No existe el directorio '$DIR_TRIGGERS'"
fi

echo "SET TERM ;#" >> "$ARCHIVO_DESTINO"

echo "Archivo generado en: $ARCHIVO_DESTINO"
