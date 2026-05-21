# PhonAPI

PhonAPI is a prototype REST API for integrating automatic phonetic transcription
models into applications without coupling those applications to one specific model
implementation.

The project is currently being planned as a TypeScript/Express reference
implementation, with support for model adapters that may call Python ML workers or
other model-serving backends.

The TypeScript/Express API lives in `api/`.

Run it with:

```bash
cd api
pnpm install --frozen-lockfile
pnpm dev
```
