# from fastapi import APIRouter, HTTPException
# from langchain_google_genai import ChatGoogleGenerativeAI 
# from langchain_core.prompts import PromptTemplate
# from db import get_db

# router = APIRouter()

# @router.post('/analyze')
# def results(payload: dict):
#     job = payload.get("jobid")
#     batch = payload.get("batch_id")
#     conn = get_db()

#     try:
#         cursor = conn.cursor()
#         query = """SELECT full_name, resume_text FROM students WHERE batch_id=%s"""
#         cursor.execute(query, (batch,))  # batch must be inside a tuple
#         data = cursor.fetchall()

#         students = [{"name": row["full_name"], "resume_text": row["resume_text"]} for row in data]

#         model=ChatGoogleGenerativeAI(model="gemini-2.5-flash")

#         prompt=PromptTemplate(template="""""")

#     finally:
#         cursor.close()
#         conn.close()


from fastapi import APIRouter, HTTPException
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv
from db import get_db
import json
import re
import os

router = APIRouter()
load_dotenv()

# Pydantic Models for Structured Output
class ResumeSummary(BaseModel):
    name: str = Field(description="Student's full name")
    summary: str = Field(description="Concise resume summary highlighting key skills, experience, education, and certifications")

class JobMatchAnalysis(BaseModel):
    name: str = Field(description="Student's full name")
    matching_percentage: float = Field(description="Match percentage between resume and job (0-100)")
    matched_keywords: List[str] = Field(description="Keywords from resume that match job requirements")
    areas_to_strengthen: List[str] = Field(description="Areas needing improvement based on job requirements")
    recommendation: str = Field(description="Brief recommendation for improvement")

@router.post('/analyze')
async def results(payload: dict):
    batch_id = payload.get("batch_id")
    job_obj = payload.get("jobid")

    if not batch_id or not job_obj:
        raise HTTPException(status_code=400, detail="batch_id and job object are required")

    # Initialize LLM
    api_key = os.getenv("GOOGLE_API_KEY")
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
    )

    # Initialize JSON output parser
    json_parser = JsonOutputParser()

    # Fetch student resumes
    conn = get_db()
    try:
        cursor = conn.cursor()
        query = """SELECT full_name, resume_text FROM students WHERE batch_id=%s"""
        cursor.execute(query, (batch_id,))
        data = cursor.fetchall()
        
        if not data:
            raise HTTPException(status_code=404, detail="No students found for this batch")

        students = [{"name": row["full_name"], "resume_text": row["resume_text"]} for row in data]

        # Step 1: Resume Summarization
        summary_prompt = PromptTemplate(
            template="""
            Analyze these resumes and create concise summaries focusing on:
            - Key technical/hard skills
            - Professional experience and notable projects
            - Education background
            - Relevant certifications
            
            Resume Data:
            {batch_resumes}
            
            Return a valid JSON array of objects with "name" and "summary" fields.
            Do not include any additional text or formatting.
            """,
            input_variables=["batch_resumes"]
        )

        # Create chain with new syntax
        summary_chain = summary_prompt | llm | json_parser
        
        batch_resumes_json = json.dumps(students)
        summaries_output = await summary_chain.ainvoke({"batch_resumes": batch_resumes_json})

        # Step 2: Job Matching Analysis
        match_prompt = PromptTemplate(
            template="""
            Evaluate how well each candidate’s resume aligns with the given job title, description, and requirements. For every candidate, calculate a matching percentage (0–100) based on overlap with required skills and responsibilities, extract specific matched keywords/skills, identify missing or weak areas to strengthen, and provide a short actionable recommendation. Return the result strictly as JSON with one object per candidate
            
            Job Title: {job_title}
            Job Description: {job_description}
            Job Requirements: {job_requirements}
            job Skills:{job_skills}
            
            Candidate Summaries:
            {candidate_summaries}

            Calculate a matching percentage (0–100) strictly using this rubric:
- 60% weight: Overlap between job requirements and candidate skills
- 20% weight: Overlap between job responsibilities and candidate experience
- 20% weight: Presence of relevant education/certifications

Scoring:
- 0 means no overlap
- 100 means perfect overlap
- Partial matches should result in intermediate scores

            
            For each candidate, provide a JSON array with objects containing:
            - name: Student name
            - matching_percentage: Number between 0-100
            - areas_to_strengthen: Array of areas needing improvement
            - keywords: those keywords that are matched and good keep less than 6
            - missing_keywords: those keywords are not there but has to be there for improvment
        
            
            Return only valid JSON without any additional text.
            """,
            input_variables=[
                "job_title", 
                "job_description", 
                "job_requirements",
                "job_skills",
                "candidate_summaries"
            ]
        )

        # Create matching chain
        match_chain = match_prompt | llm | json_parser
        
        match_output = await match_chain.ainvoke({
            "job_title": job_obj.get("title", ""),
            "job_description": job_obj.get("description", ""),
            "job_requirements": job_obj.get("requirements", ""),
            "job_skills":job_obj.get("skills",""),
            "candidate_summaries": json.dumps(summaries_output)
        })

        return {"results": match_output}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")
    finally:
        cursor.close()
        conn.close()