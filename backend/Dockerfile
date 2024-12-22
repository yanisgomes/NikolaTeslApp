FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# On utilise gunicorn pour la production
# CMD ["gunicorn", "-b", "0.0.0.0:3000", "run:app"]

# On utilise flask pour le développement
CMD ["flask", "run", "--host=0.0.0.0", "--port=3000", "--debug"]
