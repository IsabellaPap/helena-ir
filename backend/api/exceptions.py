class InsufficientDataError(Exception):
    def __init__(self, detail: str):
        self.detail = {"error": detail}

class InvalidInputError(Exception):
    def __init__(self, detail: str):
        self.detail = {"error": detail}
