from app import app, db
from sqlalchemy import text

with app.app_context():
    print("Aplicando migración de idioma_id a curso_idioma...")
    
    # Crear tabla curso_idioma
    db.session.execute(text("""
        CREATE TABLE IF NOT EXISTS curso_idioma (
            curso_id INTEGER NOT NULL,
            idioma_id INTEGER NOT NULL,
            PRIMARY KEY (curso_id, idioma_id),
            FOREIGN KEY(curso_id) REFERENCES curso("idCurso"),
            FOREIGN KEY(idioma_id) REFERENCES idioma("idIdioma")
        )
    """))
    print("✓ Tabla curso_idioma creada")
    
    # Migrar datos existentes
    result = db.session.execute(text("""
        INSERT INTO curso_idioma (curso_id, idioma_id)
        SELECT "idCurso", idioma_id
        FROM curso
        WHERE idioma_id IS NOT NULL
        ON CONFLICT DO NOTHING
    """))
    print(f"✓ {result.rowcount} relaciones migradas de idioma_id a curso_idioma")
    
    # Eliminar constraint y columna idioma_id
    try:
        db.session.execute(text("ALTER TABLE curso DROP CONSTRAINT IF EXISTS curso_idioma_id_fkey"))
        print("✓ Constraint eliminado")
    except Exception as e:
        print(f"⚠ Constraint ya no existe: {e}")
    
    try:
        db.session.execute(text("ALTER TABLE curso DROP COLUMN IF EXISTS idioma_id"))
        print("✓ Columna idioma_id eliminada")
    except Exception as e:
        print(f"⚠ Error eliminando columna: {e}")
    
    db.session.commit()
    print("✅ Migración completada exitosamente!")
