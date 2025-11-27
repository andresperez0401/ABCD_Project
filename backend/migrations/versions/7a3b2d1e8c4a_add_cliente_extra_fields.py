"""add cliente extra fields

Revision ID: 7a3b2d1e8c4a
Revises: 2bf08edc29f4
Create Date: 2025-11-26 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '7a3b2d1e8c4a'
down_revision = '2bf08edc29f4'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('cliente') as batch_op:
        batch_op.add_column(sa.Column('duracion', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('edad', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('como_se_entero', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('como_se_entero_otro', sa.String(length=255), nullable=True))


def downgrade():
    with op.batch_alter_table('cliente') as batch_op:
        batch_op.drop_column('como_se_entero_otro')
        batch_op.drop_column('como_se_entero')
        batch_op.drop_column('edad')
        batch_op.drop_column('duracion')
