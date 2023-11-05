import unittest
from fastapi.testclient import TestClient
from ..main import app
from ..services import calculate_bmi

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
            "weight_kg": None, 
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
        response = self.client.post("/calculate/fmi", json={
            "height_cm": 180,
            "weight_kg": None,
            "fat_mass_kg": None,
            "body_fat_percentage": 20
        })
        assert response.status_code == 400
        assert "Insufficient data provided. Please provide the height and fat mass or the height, weight, and bodyfat percentage" in response.json()['detail']['error']

        # all the optional inputs
        # note: it calculates using fat mass.
        # It doesn't check if weight_kg * body_fat_percentage/100 = fat_mass_kg
        response = self.client.post("/calculate/fmi", json={
            "height_cm": 180,
            "weight_kg": 75,
            "fat_mass_kg": 15,
            "body_fat_percentage": 20
        })
        assert response.status_code == 200
        assert response.json() == {"fmi": 4.63}

        # boundary conditions
        # height greater than upper bound
        response = self.client.post("/calculate/fmi", json={
            "height_cm": 250,
            "weight_kg": 75,
            "fat_mass_kg": 15,
            "body_fat_percentage": 20
        })
        assert response.status_code == 422
        assert "less_than" in response.json()['detail'][0]['type']

        # height less than lower bound
        response = self.client.post("/calculate/fmi", json={
            "height_cm": 20,
            "weight_kg": 75,
            "fat_mass_kg": 15,
            "body_fat_percentage": 20
        })
        assert response.status_code == 422
        assert "greater_than" in response.json()['detail'][0]['type']
        
        # all fields are invalid (out of bounds)
        response = self.client.post("/calculate/fmi", json={
            "height_cm": 300,
            "weight_kg": 10,
            "fat_mass_kg": 0,
            "body_fat_percentage": 100
        })
        assert response.status_code == 422
        errors = response.json()['detail']
        assert len(errors) >= 4
    
    def test_calculate_vo2max_endpoint(self):
        # successful case
        response = self.client.post("/calculate/vo2max", json={
            "speed_km_per_h": 9, 
            "age_yr": 12
        })
        assert response.status_code == 200
        assert response.json() == {"vo2max": 37.78}

        # negative speed (invalid input)
        response = self.client.post("/calculate/vo2max", json={
            "speed_km_per_h": -3, 
            "age_yr": 12
        })
        assert response.status_code == 422
        assert "greater_than" in response.json()['detail'][0]['type']

        # age over 18 years (this model is targets children and adolescents)
        response = self.client.post("/calculate/vo2max", json={
            "speed_km_per_h": 8.5, 
            "age_yr": 30
        })
        assert response.status_code == 422
        assert "less_than" in response.json()['detail'][0]['type']
    
    def test_calculate_risk_score_endpoint(self):
        # successful case for male
        response = self.client.post("/calculate/risk-score", json={
            "gender": "male",
            "vo2max": 45,
            "bmi": 25,
            "fmi": 10,
            "tv_hours": 2
        })
        assert response.status_code == 200
        assert response.json() == {"risk_score": 22}

        # successful case for female
        response = self.client.post("/calculate/risk-score", json={
            "gender": "female",
            "vo2max": 30,
            "bmi": 17,
            "fmi": 10,
            "tv_hours": 2
        })
        assert response.status_code == 200
        assert response.json() == {"risk_score": 10}

        # successful female, but with appropriate values for female (no bmi)
        response = self.client.post("/calculate/risk-score", json={
            "gender": "female",
            "vo2max": 40,
            "fmi": 10,
            "tv_hours": 2
        })
        assert response.status_code == 200
        assert response.json() == {"risk_score": 25}

        # male but missing male factor (optional for pydantic)
        response = self.client.post("/calculate/risk-score", json={
            "gender": "male",
            "vo2max": 40,
            "fmi": 10,
            "tv_hours": 2
        })
        assert response.status_code == 400
        assert "For male children, BMI is required to calculate risk score." in response.json()['detail']['error']

        # same for female
        response = self.client.post("/calculate/risk-score", json={
            "gender": "female",
            "vo2max": 40,
            "fmi": 10
        })
        assert response.status_code == 400
        assert "For female children, hours of TV viewed per day is required to calculate risk score." in response.json()['detail']['error']


        # add tests for boundary conditions and invalid input
        # missing vo2max (required by pydantic model)
        response = self.client.post("/calculate/risk-score", json={
            "gender": "male",
            "vo2max": 40,
            "fmi": 10,
            "tv_hours": 2
        })
        assert response.status_code == 400
        assert "For male children, BMI is required to calculate risk score." in response.json()['detail']['error']

       
        # wrong value for gender
        response = self.client.post("/calculate/risk-score", json={
            "gender": "NA",
            "vo2max": 40,
            "fmi": 10,
            "tv_hours": 2
        })
        assert response.status_code == 422
        assert "enum" in response.json()['detail'][0]['type']

        # wrong VO2 max value
        response = self.client.post("/calculate/risk-score", json={
            "gender": "female",
            "vo2max": -30,
            "fmi": 10,
            "tv_hours": 2
        })
        assert response.status_code == 422
        assert "greater_than" in response.json()['detail'][0]['type']


    def test_classify_risk_score_endpoint(self):
        # successful classification
        response = self.client.post("/classify/risk-score", json={
            "risk_score": 10,
            "gender": "female"
        })
        assert response.status_code == 200
        assert response.json() == {"classification": "very low"}

        # more correct assessments
        response = self.client.post("/classify/risk-score", json={
            "risk_score": 29,
            "gender": "male"
        })
        print(response.json())
        assert response.status_code == 200
        assert response.json() == {"classification": "very high"}

        response = self.client.post("/classify/risk-score", json={
            "risk_score": 14,
            "gender": "male"
        })
        assert response.status_code == 200
        assert response.json() == {"classification": "medium"}

        response = self.client.post("/classify/risk-score", json={
            "risk_score": 17,
            "gender": "female"
        })
        assert response.status_code == 200
        assert response.json() == {"classification": "low"}

        # test with invalid input (non-existent risk score)
        response = self.client.post("/classify/risk-score", json={
            "risk_score": 35,
            "gender": "male"
        })
        assert response.status_code == 422
        assert "The risk score you provided is not valid. Check the config file for the specified cut-offs." in response.json()['detail']['error']

if __name__ == "__main__":
    unittest.main()
