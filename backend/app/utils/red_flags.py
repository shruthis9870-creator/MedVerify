RED_FLAG_PATTERNS = [
    "chest pain",
    "breathing trouble",
    "shortness of breath",
    "fainting",
    "fainted",
    "seizure",
    "convulsion",
    "stroke",
    "paralysis",
    "unable to speak",
    "heavy bleeding",
    "bleeding heavily",
    "unconscious",
    "very high fever",
    "confusion",
    "suicidal",
    "self harm",
]

def contains_red_flags(text: str) -> bool:
    normalized = text.lower()
    return any(pattern in normalized for pattern in RED_FLAG_PATTERNS)