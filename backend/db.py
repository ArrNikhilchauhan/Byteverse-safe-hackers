import pymysql
from contextlib import contextmanager

# Connection settings
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Admin",
    "database": "jobs",
    "cursorclass": pymysql.cursors.DictCursor   # results as dicts
}


def get_db():
    conn = pymysql.connect(**DB_CONFIG)
    return conn
