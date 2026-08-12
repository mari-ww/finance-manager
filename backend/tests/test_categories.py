from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_category_without_token():
    response = client.post(
        "/categories/",
        json={
            "name": "Teste",
            "type": "expense",
        },
    )

    assert response.status_code == 401

def test_get_categories_authenticated():
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/categories/",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_category_authenticated():
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    token = login_response.json()["access_token"]

    create_response = client.post(
        "/categories/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "name": "Categoria Teste",
            "type": "expense",
        },
    )

    category_id = create_response.json()["id"]

    response = client.put(
        f"/categories/{category_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "name": "Categoria Atualizada",
            "type": "expense",
        },
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Categoria Atualizada"

def test_delete_category_authenticated():
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    token = login_response.json()["access_token"]

    create_response = client.post(
        "/categories/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "name": "Categoria Para Deletar",
            "type": "expense",
        },
    )

    category_id = create_response.json()["id"]

    response = client.delete(
        f"/categories/{category_id}",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Category deleted"

def test_user_cannot_delete_other_users_category():
    login_response = client.post(
        "/auth/login",
        json={
            "email": "teste@example.com",
            "password": "123456",
        },
    )

    token = login_response.json()["access_token"]

    response = client.delete(
        "/categories/1",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Category not found"