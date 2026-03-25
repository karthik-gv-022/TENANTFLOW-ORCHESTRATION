from .database import engine
from .models import Base

# create all tables
Base.metadata.create_all(bind=engine)

print("All tables created successfully!")