"""migrar de idioma_id a tabla curso_idioma

Revision ID: cd3f19ab4567
Revises: bcd2b58b1296
Create Date: 2025-11-26 14:50:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cd3f19ab4567'
down_revision = 'bcd2b58b1296'
branch_labels = None
depends_on = None


def upgrade():
    # Verificar si la tabla curso_idioma ya existe
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()
    
    if 'curso_idioma' not in tables:
        # Crear tabla de asociación curso_idioma
        op.create_table('curso_idioma',
            sa.Column('curso_id', sa.Integer(), nullable=False),
            sa.Column('idioma_id', sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(['curso_id'], ['curso.idCurso'], ),
            sa.ForeignKeyConstraint(['idioma_id'], ['idioma.idIdioma'], ),
            sa.PrimaryKeyConstraint('curso_id', 'idioma_id')
        )
    
    # Verificar si la columna idioma_id existe en curso
    curso_columns = [col['name'] for col in inspector.get_columns('curso')]
    
    if 'idioma_id' in curso_columns:
        # Migrar datos existentes: copiar idioma_id a la tabla de asociación
        op.execute("""
            INSERT INTO curso_idioma (curso_id, idioma_id)
            SELECT "idCurso", idioma_id
            FROM curso
            WHERE idioma_id IS NOT NULL
            ON CONFLICT DO NOTHING
        """)
        
        # Eliminar la columna idioma_id de la tabla curso
        op.drop_constraint('curso_idioma_id_fkey', 'curso', type_='foreignkey')
        op.drop_column('curso', 'idioma_id')


def downgrade():
    # Recrear columna idioma_id en tabla curso
    op.add_column('curso', sa.Column('idioma_id', sa.Integer(), nullable=True))
    op.create_foreign_key('curso_idioma_id_fkey', 'curso', 'idioma', ['idioma_id'], ['idIdioma'])
    
    # Migrar datos de vuelta (tomar el primer idioma de la relación)
    op.execute("""
        UPDATE curso
        SET idioma_id = (
            SELECT idioma_id
            FROM curso_idioma
            WHERE curso_idioma.curso_id = curso."idCurso"
            LIMIT 1
        )
    """)
    
    # Eliminar tabla de asociación
    op.drop_table('curso_idioma')
