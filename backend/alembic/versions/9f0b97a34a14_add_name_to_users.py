"""add name to users

Revision ID: 9f0b97a34a14
Revises: 6cbfdd4f5fc6
Create Date: 2026-09-12 14:18:03.353776

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9f0b97a34a14"
down_revision: Union[str, Sequence[str], None] = "6cbfdd4f5fc6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "users",
        sa.Column(
            "name",
            sa.String(length=100),
            nullable=True,
        ),
    )

    op.execute(
        "UPDATE users SET name = 'Usuária' WHERE name IS NULL"
    )

    op.alter_column(
        "users",
        "name",
        existing_type=sa.String(length=100),
        nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("users", "name")