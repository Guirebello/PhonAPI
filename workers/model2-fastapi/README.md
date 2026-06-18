Whisper (faster-whisper) ASR worker. Emits orthographic text; G2P → IPA is done
by the TS Adapter (`WhisperEnAdapter`), not here.

Run with:

```sh
uv run uvicorn app.main:app --port 8001
```
