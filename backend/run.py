import os
import sys
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    print(f"Starting Pragati AI backend on 0.0.0.0:{port}...", flush=True)
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
