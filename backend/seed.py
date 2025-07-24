# backend/seed.py
import os
from sqlalchemy import text
from app import db, app  # importa la instancia de tu app Flask

SCRIPTS_DIR = './scripts'

def run_sql_file(filename):
    with open(os.path.join(SCRIPTS_DIR, filename), 'r', encoding='utf-8') as file:
        sql = file.read()
        with db.engine.connect() as conn:
            conn.execute(text(sql))

def seed():
    files = [
        'Destinos.sql',
        'Ciudades.sql',
        'Idioma.sql',
        'Servicios.sql',
        'Curso.sql',
        'CursoServicios.sql',
        'Testimonio.sql'
    ]
    for file in files:
        run_sql_file(file)

if __name__ == '__main__':
    with app.app_context():
        seed()
