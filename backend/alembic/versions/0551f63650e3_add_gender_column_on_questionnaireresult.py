"""add gender column on QuestionnaireResult

Revision ID: 0551f63650e3
Revises: 9d791a4b059c
Create Date: 2024-02-09 19:07:01.015389

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0551f63650e3'
down_revision: Union[str, None] = '9d791a4b059c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('questionnaire_results', sa.Column('gender', sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('questionnaire_results', 'gender')
    # ### end Alembic commands ###