import unittest
from fastapi.testclient import TestClient
from main import app

class TestApp(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        
    def test_classify_bodyfat(self):
        response = self.client.post("/classify/bodyfat", json={"age_yr": 10, "gender": "male", "body_fat_percentage": 15.5})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"classification": "overfat"})

    def test_classify_bmi(self):
        response = self.client.post("/classify/bmi", json={"bmi": 25})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"classification": "overweight"})

if __name__ == "__main__":
    unittest.main()
