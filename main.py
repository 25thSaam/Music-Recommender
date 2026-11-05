from fastapi import FastAPI, Request, HTTPException, status, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", include_in_schema=False)
def home(request: Request):
    return FileResponse('static/index.html')