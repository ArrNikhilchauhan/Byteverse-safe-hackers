from fastapi import APIRouter
from pydantic import BaseModel,Field
from db import get_db

router=APIRouter()

@router.get('/')
def fetch_batch():
    conn=get_db()
    try:
        cursor=conn.cursor()
        query=""" SELECT b.id, b.batch_name,b.department, COUNT(s.id) AS student_count
        FROM batch b
        LEFT JOIN students s ON b.id = s.batch_id
        GROUP BY b.id"""
        cursor.execute(query)
        
        data=cursor.fetchall()
        return data

    finally:
        cursor.close()
        conn.close()


class BatchCreate(BaseModel):
    batch_name:str=Field(...,description="Batch Name")
    department:str=Field(...,description="Department")
    year:int=Field("year of that batch")
@router.post('/add')
def add_batch(batch:BatchCreate):
    conn=get_db()
  
    try:
        cursor=conn.cursor()
        query="""Insert into batch (batch_name,department,year) values(%s,%s,%s)"""

        cursor.execute(query,(batch.batch_name,batch.department,batch.year))

        conn.commit()
        batch_id = cursor.lastrowid

        return {
    "id": batch_id,
    "batch_name": batch.batch_name,
    "department": batch.department,
    "year": batch.year
}
    finally:
        cursor.close()
        conn.close()