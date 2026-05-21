from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, File, HTTPException, UploadFile

from .audio import load_and_resample
from .inference import MODEL_ID, Transcriber

state: dict = {}


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    state["transcriber"] = Transcriber()
    yield
    state.clear()


app = FastAPI(lifespan=lifespan)


@app.get("/health")
def health() -> dict:
    loaded = "transcriber" in state
    return {
        "status": "ready" if loaded else "loading",
        "model": MODEL_ID,
        "loaded": loaded,
    }


@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)) -> dict:
    raw = await audio.read()
    try:
        waveform = load_and_resample(raw)
    except Exception as exc:
        raise HTTPException(
            status_code=400, detail=f"audio decode failed: {exc}"
        ) from exc
    return state["transcriber"].transcribe(waveform)
