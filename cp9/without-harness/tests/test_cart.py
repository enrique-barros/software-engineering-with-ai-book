from src.cart import calculate_total


def test_total_without_discount():
    items = [
        {"price": 10.0, "quantity": 2},
        {"price": 5.0, "quantity": 1},
    ]
    assert calculate_total(items) == 25.0


def test_save10_discount():
    items = [{"price": 100.0, "quantity": 1}]
    assert calculate_total(items, discount_code="SAVE10") == 90.0
