## Password reset

- Verification code: random, expires in 15 minutes, single-use only.
- If email does not exist: respond the same as if it existed (do not reveal which accounts exist).
- Limit: maximum 3 requests per email every 15 minutes.
- Save each attempt in a log (email, date, IP) for later review.
- Upon using the code, invalidate any other pending code for that user.
