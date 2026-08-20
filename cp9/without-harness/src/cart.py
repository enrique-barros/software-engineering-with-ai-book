SAVE10_DISCOUNT = 0.10


def calculate_total(items, discount_code=None):
    if not items:
        return 0.0

    total = sum(item["price"] * item["quantity"] for item in items)

    if discount_code == "SAVE10":
        total *= 1 - SAVE10_DISCOUNT

    return round(total, 2)
