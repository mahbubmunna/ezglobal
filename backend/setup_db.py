import os
import asyncio
import asyncpg
from dotenv import load_dotenv

load_dotenv()

USER = os.getenv("POSTGRES_USER", "postgres")
PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
SERVER = os.getenv("POSTGRES_SERVER", "localhost")
PORT = os.getenv("POSTGRES_PORT", "5432")
DB = os.getenv("POSTGRES_DB", "app")

async def create_database():
    print(f"Connecting to postgres on {SERVER}:{PORT} as {USER}...")
    try:
        # Connect to 'postgres' database to create new db
        conn = await asyncpg.connect(
            user=USER,
            password=PASSWORD,
            host=SERVER,
            port=PORT,
            database="postgres"
        )
        
        # Check if database exists
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", DB
        )
        
        if not exists:
            print(f"Database '{DB}' does not exist. Creating...")
            # Close connection to allow DB creation (cannot run inside transaction block)
            await conn.close()
            
            # Reconnect normally to execute CREATE DATABASE
            sys_conn = await asyncpg.connect(
                user=USER,
                password=PASSWORD,
                host=SERVER,
                port=PORT,
                database="postgres"
            )
            try:
                await sys_conn.execute(f'CREATE DATABASE "{DB}"')
                print(f"Database '{DB}' created successfully.")
            except Exception as e:
                print(f"Error creating database: {e}")
            finally:
                await sys_conn.close()
        else:
            print(f"Database '{DB}' already exists.")
            await conn.close()
            
    except Exception as e:
        print(f"Failed to connect or create database: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(create_database())
