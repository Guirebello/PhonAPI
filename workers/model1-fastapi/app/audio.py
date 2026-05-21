import io

import torch
import torchaudio

TARGET_SR = 16_000


def load_and_resample(raw: bytes) -> torch.Tensor:
    waveform, sr = torchaudio.load(io.BytesIO(raw))
    if waveform.shape[0] > 1:
        waveform = waveform.mean(dim=0, keepdim=True)
    if sr != TARGET_SR:
        waveform = torchaudio.functional.resample(waveform, sr, TARGET_SR)
    return waveform.squeeze(0)
