# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.models.users import User
from app.db.models.otp import OTP
