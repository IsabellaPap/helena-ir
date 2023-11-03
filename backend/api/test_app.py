import unittest
from fastapi.testclient import TestClient
from main import app
from services import calculate_bmi

class TestApp(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_calculate_bmi_endpoint(self):
        response = self.client.post("/calculate/bmi", json={"height_cm": 180, "weight_kg": 75})
        assert response.status_code == 200
        assert response.json() == {"bmi": 23.15}

        response = self.client.post("/calculate/bmi", json={"height_cm": 180})
        assert response.status_code == 422

    def test_calculate_bmi(self):
        cases = [
            (180, 75, 23.15),
            (160, 50, 19.53),
        ]

        for height_cm, weight_kg, expected_bmi in cases:
            with self.subTest(f"Testing BMI for {height_cm}cm, {weight_kg}kg"):
                bmi = calculate_bmi(height_cm, weight_kg)
                self.assertAlmostEqual(bmi, expected_bmi, places=2)
    
    def test_calculate_fmi_endpoint(self):
        # successful case with fat mass
        response = self.client.post("/calculate/fmi", json={
            "height_cm": 180, 
            "weight_kg": 75, 
            "fat_mass_kg": 15,
            "body_fat_percentage": None
        })
        assert response.status_code == 200
        assert response.json() == {"fmi": 4.63}

        # successful case with body fat percentage
        response = self.client.post("/calculate/fmi", json={
            "height_cm": 180,
            "weight_kg": 75,
            "fat_mass_kg": None,
            "body_fat_percentage": 20
        })
        assert response.status_code == 200
        assert response.json() == {"fmi": 4.63}

        # not enough optional inputs

        # all the optional inputs

        # boundary conditions

    def test_calculate_vo2max_endpoint(self):
        # Successful case
        response = self.client.post("/calculate/vo2max", json={
            "speed_km_per_h": 8, 
            "age_yr": 12
        })
        assert response.status_code == 200
        print(response.json())
        assert response.json() == {"vo2max": 32.70}

        # Test with invalid input (e.g., negative speed)
    
    def test_calculate_risk_score_endpoint(self):
        # Successful case for male
        response = self.client.post("/calculate/risk-score", json={
            "gender": "male",
            "vo2max": 45,
            "bmi": 25,
            "fmi": 10,
            "tv_hours": 2
        })
        assert response.status_code == 200
        assert response.json() == {"risk_score": 22}

        # Successful case for female

        # Similar to the above, but with appropriate values for female

        # male gender but missing male factor

        # same for female

        # Add tests for boundary conditions and invalid input

    def test_classify_risk_score_endpoint(self):
        # Successful classification
        response = self.client.post("/classify/risk-score", json={
            "risk_score": 10,
            "gender": "female"
        })
        assert response.status_code == 200
        print(response.json())
        assert response.json() == {"classification": "very low"}

        # more correct assessments

        # Test with invalid input (e.g., non-existent risk score)

if __name__ == "__main__":
    unittest.main()
