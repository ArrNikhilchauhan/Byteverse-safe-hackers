from fastapi import APIRouter, HTTPException,UploadFile,File,Form
from pydantic import BaseModel
from typing import List
from fastapi import Request
import os,shutil
from db import get_db
from pdfminer.high_level import extract_text

router = APIRouter()
class StudentCreate(BaseModel):
    full_name: str
    email: str
    phone: str | None = None
    dob: str      # format: dd-mm-yyyy
    course: str
    resume_text: str
    skills: List[str]
    batch_id: int

@router.post("/add")
@router.post("/add")
async def create_student(
    full_name: str = Form(...),
    email: str = Form(...),
    phone: str | None = Form(None),
    dob: str = Form(...),
    course: str = Form(...),
    resume_text: str = Form(...),
    skills: str = Form(...),   # comma-separated string from Swagger
    batch_id: int = Form(...),
    resume_file: UploadFile = File(None)
):
    # Convert skills string to list
    skills_list = [skill.strip() for skill in skills.split(",") if skill.strip()]

    # Build Pydantic model
    student_data = StudentCreate(
        full_name=full_name,
        email=email,
        phone=phone,
        dob=dob,
        course=course,
        resume_text=resume_text,
        skills=skills_list,
        batch_id=batch_id
    )

    conn = get_db()
    cursor = conn.cursor()

    try:
        # Handle resume PDF
        resume_url = None
        final_resume_text = student_data.resume_text

        if resume_file:
            uploads_dir = "uploads/resumes"
            os.makedirs(uploads_dir, exist_ok=True)
            file_path = os.path.join(uploads_dir, resume_file.filename)

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(resume_file.file, buffer)

            resume_url = f"/uploads/resumes/{resume_file.filename}"

            final_resume_text = extract_text(file_path)

        # Insert into DB
        cursor.execute(
            """
            INSERT INTO students 
            (full_name, email, phone, skills, dob, course, resume_text, batch_id, resume_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                student_data.full_name,
                student_data.email,
                student_data.phone,
                ",".join(student_data.skills),
                student_data.dob,
                student_data.course,
                final_resume_text,
                student_data.batch_id,
                resume_url
            )
        )
        student_id = cursor.lastrowid
        conn.commit()

        return {
            "id": student_id,
            **student_data.dict(),
            "skills": ",".join(student_data.skills),
            "resume_url": resume_url,
            "resume_text": final_resume_text
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()


@router.put("/students/{student_id}")
def update_student(student_id: int, student: StudentCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            UPDATE students 
            SET full_name=%s, email=%s, phone=%s, dob=STR_TO_DATE(%s, '%%d-%%m-%%Y'),
                course=%s, resume_text=%s, batch_id=%s
            WHERE id=%s
            """,
            (student.full_name, student.email, student.phone, student.dob,
             student.course, student.resume_text, student.batch_id, student_id)
        )
        conn.commit()
        return {"id": student_id, **student.dict()}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        conn.close()


@router.get('/fetch')
def fetch_student():
    conn=get_db()
    try:
        cursor=conn.cursor()
        query="select * from students"
        cursor.execute(query)

        data=cursor.fetchall()

        return data
    finally:
        cursor.close()
        conn.close()