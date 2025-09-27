from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import students,batches,results
from fastapi.staticfiles import StaticFiles
import json

app=FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, PUT, DELETE
    allow_headers=["*"], 
)

app.include_router(router=students.router,prefix='/students',tags=['Students'])
app.include_router(router=batches.router,prefix='/batches',tags=['Batches'])
app.include_router(router=results.router,prefix='/results',tags=['Results'])


def load_data():
    with open('sample.json','r') as f:
        data=json.load(f)
    return data

@app.get('/')
def data():
    data=load_data()
    return data