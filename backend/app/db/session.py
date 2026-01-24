from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
import ssl

# Define connect_args based on environment
connect_args = {}
db_uri = str(settings.SQLALCHEMY_DATABASE_URI)
if "neon.tech" in db_uri or "aws" in db_uri or "sslmode" in db_uri: 
    # Create an SSL context for secure connections (Neon etc)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    connect_args["ssl"] = ctx

engine = create_async_engine(db_uri, connect_args=connect_args, echo=False, future=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
