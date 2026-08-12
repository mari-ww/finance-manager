from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_transaction_authenticated():
    # Login
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    # Criar transação
    response = client.post(
        "/transactions/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "category_id": 3,
            "type": "expense",
            "amount": 50,
            "description": "Teste automatizado",
            "date": "2026-08-12",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["user_id"] == 2
    assert data["category_id"] == 3
    assert data["type"] == "expense"
    assert data["amount"] == "50.00"

def test_get_transactions_authenticated():
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    response = client.get(
        "/transactions/",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

def test_update_transaction_authenticated():
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    token = login_response.json()["access_token"]

    create_response = client.post(
        "/transactions/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "category_id": 3,
            "type": "expense",
            "amount": 50,
            "description": "Teste",
            "date": "2026-08-12",
        },
    )

    transaction_id = create_response.json()["id"]

    response = client.put(
        f"/transactions/{transaction_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "category_id": 3,
            "type": "expense",
            "amount": 75,
            "description": "Teste atualizado",
            "date": "2026-08-12",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["amount"] == "75.00"
    assert data["description"] == "Teste atualizado"

def test_delete_transaction_authenticated():
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    token = login_response.json()["access_token"]

    create_response = client.post(
        "/transactions/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "category_id": 3,
            "type": "expense",
            "amount": 50,
            "description": "Teste para deletar",
            "date": "2026-08-12",
        },
    )

    transaction_id = create_response.json()["id"]

    response = client.delete(
        f"/transactions/{transaction_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200

    assert response.json() == {
        "message": "Transaction deleted"
    }

def test_user_cannot_delete_other_users_transaction():
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    token = login_response.json()["access_token"]

    response = client.delete(
        "/transactions/1",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Transaction not found"