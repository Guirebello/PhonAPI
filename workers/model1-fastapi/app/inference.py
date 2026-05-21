import time

import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

from .audio import TARGET_SR

HF_MODEL_ID = "caiocrocha/wav2vec2-large-xlsr-53-phoneme-portuguese"
MODEL_ID = "xlsr-pt-br"


class Transcriber:
    def __init__(self) -> None:
        self.processor = Wav2Vec2Processor.from_pretrained(HF_MODEL_ID)
        self.model = Wav2Vec2ForCTC.from_pretrained(HF_MODEL_ID)
        self.model.eval()
        self._warmup()

    @torch.inference_mode()
    def _warmup(self) -> None:
        silence = torch.zeros(TARGET_SR, dtype=torch.float32)
        inputs = self.processor(silence.numpy(), sampling_rate=TARGET_SR, return_tensors="pt")
        self.model(inputs.input_values)

    @torch.inference_mode()
    def transcribe(self, waveform: torch.Tensor) -> dict:
        start = time.perf_counter()
        inputs = self.processor(waveform.numpy(), sampling_rate=TARGET_SR, return_tensors="pt")
        logits = self.model(inputs.input_values).logits
        predicted_ids = torch.argmax(logits, dim=-1)
        ipa = self.processor.batch_decode(predicted_ids)[0]
        duration_ms = int((time.perf_counter() - start) * 1000)
        return {
            "modelId": MODEL_ID,
            "ipa": ipa,
            "durationMs": duration_ms,
            "segments": [],
        }
