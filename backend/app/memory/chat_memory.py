from collections import defaultdict, deque

MAX_HISTORY = 8


class ChatMemory:
    """
    Lightweight in-memory conversation memory.
    Stores the latest few exchanges per user.
    """

    def __init__(self):
        self._history = defaultdict(
            lambda: deque(maxlen=MAX_HISTORY)
        )

    def add(self, user_id: str, role: str, content: str):

        self._history[user_id].append(
            {
                "role": role,
                "content": content,
            }
        )

    def get(self, user_id: str):

        return list(self._history[user_id])

    def clear(self, user_id: str):

        self._history[user_id].clear()


memory = ChatMemory()