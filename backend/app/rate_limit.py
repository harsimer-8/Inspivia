from __future__ import annotations

import threading
import time
from dataclasses import dataclass


@dataclass
class _Bucket:
    tokens: float
    updated_at: float


class RateLimitingService:
    """Thread-safe in-memory token bucket matching the former security primitive."""

    def __init__(self):
        self._buckets: dict[str, _Bucket] = {}
        self._lock = threading.Lock()

    def try_consume(self, key: str, capacity: int, refill_seconds: float) -> bool:
        if capacity <= 0 or refill_seconds <= 0:
            raise ValueError("capacity and refill duration must be positive")
        now = time.monotonic()
        with self._lock:
            bucket = self._buckets.get(key)
            if bucket is None:
                self._buckets[key] = _Bucket(float(capacity - 1), now)
                return True
            refilled = min(capacity, bucket.tokens + (now - bucket.updated_at) * capacity / refill_seconds)
            if refilled < 1:
                bucket.tokens = refilled
                bucket.updated_at = now
                return False
            bucket.tokens = refilled - 1
            bucket.updated_at = now
            return True
