import io
import time

import numpy as np
from faster_whisper import WhisperModel

MODEL_ID = "whisper-en"
WHISPER_SIZE = "small"
LANGUAGE = "en"
TARGET_SR = 16_000


class Transcriber:
    """Bare ASR model: audio -> orthographic text (+ timestamps).

    This worker deliberately does NOT produce IPA. Grapheme->phoneme conversion
    is the Adapter's job on the PhonAPI side, so the worker stays a
    plain Whisper model. faster-whisper decodes/resamples the input itself
    (via PyAV), so no manual audio handling is needed here.
    """

    def __init__(self) -> None:
        self.model = WhisperModel(WHISPER_SIZE, device="cpu", compute_type="int8")
        self._warmup()

    def _warmup(self) -> None:
        silence = np.zeros(TARGET_SR, dtype=np.float32)
        segments, _ = self.model.transcribe(silence, language=LANGUAGE)
        list(segments)

    def transcribe(self, raw: bytes) -> dict:
        start = time.perf_counter()
        segments, info = self.model.transcribe(io.BytesIO(raw), language=LANGUAGE)
        seg_list = [
            {"start": s.start, "end": s.end, "text": s.text} for s in segments
        ]
        text = "".join(s["text"] for s in seg_list).strip()
        duration_ms = int((time.perf_counter() - start) * 1000)
        return {
            "text": text,
            "language": info.language,
            "durationMs": duration_ms,
            "segments": seg_list,
        }
