import os
import pytest
from dotenv import load_dotenv

load_dotenv()

# Test credentials - not real secrets
TEST_PASSWORD = "testpass123"  # noqa: S105
TEST_PASSWORD_STRONG = "TestPass123!"  # noqa: S105

@pytest.fixture(scope="session")
def django_db_setup():
    pass
