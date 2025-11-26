"""migrar de destino_id a tabla curso_destino

Revision ID: bcd2b58b1296
Revises: 2b9607e7b5e2
Create Date: 2025-11-26 14:02:49.160307

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bcd2b58b1296'
down_revision = '2b9607e7b5e2'
branch_labels = None
depends_on = None


def upgrade():
    # Verificar si la tabla curso_destino ya existe
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()
    
    if 'curso_destino' not in tables:
        # Crear tabla de asociación curso_destino
        op.create_table('curso_destino',
            sa.Column('curso_id', sa.Integer(), nullable=False),
            sa.Column('destino_id', sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(['curso_id'], ['curso.idCurso'], ),
            sa.ForeignKeyConstraint(['destino_id'], ['destino.idDestino'], ),
            sa.PrimaryKeyConstraint('curso_id', 'destino_id')
        )
    
    # Verificar si la columna destino_id existe en curso
    curso_columns = [col['name'] for col in inspector.get_columns('curso')]
    
    if 'destino_id' in curso_columns:
        # Migrar datos existentes: copiar destino_id a la tabla de asociación
        op.execute("""
            INSERT INTO curso_destino (curso_id, destino_id)
            SELECT "idCurso", destino_id
            FROM curso
            WHERE destino_id IS NOT NULL
            ON CONFLICT DO NOTHING
        """)
        
        # Eliminar la columna destino_id de la tabla curso
        op.drop_constraint('curso_destino_id_fkey', 'curso', type_='foreignkey')
        op.drop_column('curso', 'destino_id')


def downgrade():
    # Agregar columna destino_id de vuelta
    op.add_column('curso', sa.Column('destino_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('curso_destino_id_fkey', 'curso', 'destino', ['destino_id'], ['idDestino'])
    
    # Migrar datos de vuelta (solo el primer destino si hay múltiples)
    op.execute("""
        UPDATE curso
        SET destino_id = (
            SELECT destino_id 
            FROM curso_destino 
            WHERE curso_destino.curso_id = curso."idCurso" 
            LIMIT 1
        )
    """)
    
    # Eliminar tabla de asociación
    op.drop_table('curso_destino')
