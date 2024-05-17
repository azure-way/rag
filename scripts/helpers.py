import os

def getenvordefault(key, default=None):
    """Get an environment variable, return None if it doesn't exist or it's empty.
    The optional second argument can specify an alternate default.
    key, default and the result are str."""
    if value := os.getenv(key):
        if value.strip():
            return value
        else:
            return default
    else:
        return default