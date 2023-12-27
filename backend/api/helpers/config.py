import json
from typing import Dict

def load_config(file_path: str) -> Dict:
    try:
        with open(file_path, 'r') as config_file:
            return json.load(config_file)
    except FileNotFoundError:
        raise Exception(f"Configuration file {file_path} not found.")
    except json.JSONDecodeError:
        raise Exception(f"Configuration file {file_path} contains invalid JSON.")