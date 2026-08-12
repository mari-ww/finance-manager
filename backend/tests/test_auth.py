from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_login():
    response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password():
    response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "senha_errada",
        },
    )

    assert response.status_code == 401

def test_transactions_without_token():
    response = client.get("/transactions/")

    assert response.status_code == 401