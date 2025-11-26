"""
Script para poblar la base de datos con datos iniciales
Ejecuta todos los scripts SQL en el orden correcto
"""
import os
import sys
from pathlib import Path

# Agregar el directorio padre al path para poder importar app
sys.path.insert(0, str(Path(__file__).parent.parent))

from app import app, db
from sqlalchemy import text

def ejecutar_sql_archivo(archivo_path):
    """Lee y ejecuta un archivo SQL"""
    print(f"Ejecutando: {archivo_path.name}")
    
    with open(archivo_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Limpiar comentarios primero
    lines = []
    for line in sql_content.split('\n'):
        # Si la línea comienza con --, saltarla completamente
        if line.strip().startswith('--'):
            continue
        # Si la línea tiene un comentario inline (--), quitarlo
        if '--' in line:
            line = line.split('--')[0]
        lines.append(line)
    
    # Unir todo y dividir por punto y coma
    cleaned_content = '\n'.join(lines)
    statements = []
    for statement in cleaned_content.split(';'):
        statement = statement.strip()
        if statement:
            statements.append(statement)
    
    # Ejecutar cada statement
    ejecutados = 0
    errores = 0
    for statement in statements:
        if statement.strip():
            try:
                db.session.execute(text(statement))
                db.session.commit()  # Commit después de cada statement
                ejecutados += 1
            except Exception as e:
                print(f"  ⚠️  Error: {str(e)[:150]}")
                db.session.rollback()  # Rollback solo este statement
                errores += 1
    
    print(f"  ✓ Completado ({ejecutados} exitosos, {errores} errores)")
    return ejecutados, errores

def limpiar_base_datos():
    """Limpia todas las tablas antes de insertar datos"""
    print("\n🗑️  Limpiando base de datos...")
    
    try:
        # Orden inverso para respetar foreign keys
        db.session.execute(text("DELETE FROM curso_servicio"))
        db.session.execute(text("DELETE FROM curso_destino"))
        db.session.execute(text("DELETE FROM curso"))
        db.session.execute(text("DELETE FROM servicio"))
        db.session.execute(text("DELETE FROM idioma"))
        db.session.execute(text("DELETE FROM ciudad"))
        db.session.execute(text("DELETE FROM destino"))
        db.session.execute(text("DELETE FROM testimonio"))
        db.session.execute(text("DELETE FROM cliente"))
        
        # Reiniciar secuencias (IDs) - usando comillas dobles correctamente
        db.session.execute(text('ALTER SEQUENCE "curso_idCurso_seq" RESTART WITH 1'))
        db.session.execute(text('ALTER SEQUENCE "servicio_idServicio_seq" RESTART WITH 1'))
        db.session.execute(text('ALTER SEQUENCE "idioma_idIdioma_seq" RESTART WITH 1'))
        db.session.execute(text('ALTER SEQUENCE "ciudad_idCiudad_seq" RESTART WITH 1'))
        db.session.execute(text('ALTER SEQUENCE "destino_idDestino_seq" RESTART WITH 1'))
        db.session.execute(text('ALTER SEQUENCE "testimonio_idTestimonio_seq" RESTART WITH 1'))
        db.session.execute(text('ALTER SEQUENCE "cliente_idCliente_seq" RESTART WITH 1'))
        
        db.session.commit()
        print("  ✓ Base de datos limpia")
    except Exception as e:
        print(f"  ⚠️  Advertencia al limpiar: {str(e)}")
        db.session.rollback()

def poblar_base_datos():
    """Ejecuta todos los scripts SQL en orden"""
    
    scripts_dir = Path(__file__).parent
    
    # Orden de ejecución según las dependencias
    archivos_sql = [
        'Destinos.sql',
        'Ciudades.sql',
        'Idioma.sql',
        'Servicios.sql',
        'Curso.sql',
        'CursoDestino.sql',
        'CursoServicios.sql',
        'Testimonio.sql'
    ]
    
    print("\n📊 Poblando base de datos...\n")
    
    for archivo in archivos_sql:
        archivo_path = scripts_dir / archivo
        
        if archivo_path.exists():
            ejecutar_sql_archivo(archivo_path)
        else:
            print(f"⚠️  Archivo no encontrado: {archivo}")
    
    print("\n✅ Base de datos poblada exitosamente!")

def verificar_datos():
    """Verifica que los datos se insertaron correctamente"""
    print("\n🔍 Verificando datos insertados...\n")
    
    tablas = [
        ('destino', 'Destinos'),
        ('ciudad', 'Ciudades'),
        ('idioma', 'Idiomas'),
        ('servicio', 'Servicios'),
        ('curso', 'Cursos'),
        ('curso_destino', 'Relaciones Curso-Destino'),
        ('curso_servicio', 'Relaciones Curso-Servicio'),
        ('testimonio', 'Testimonios')
    ]
    
    for tabla, nombre in tablas:
        try:
            result = db.session.execute(text(f"SELECT COUNT(*) FROM {tabla}"))
            count = result.scalar()
            print(f"  {nombre}: {count} registros")
        except Exception as e:
            print(f"  ⚠️  Error al verificar {nombre}: {str(e)[:50]}")
    
    print()

if __name__ == '__main__':
    with app.app_context():
        try:
            # Limpiar la base de datos automáticamente
            limpiar_base_datos()
            
            # Poblar base de datos
            poblar_base_datos()
            
            # Verificar datos
            verificar_datos()
            
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            db.session.rollback()
            sys.exit(1)
