FROM python:3.9-slim

# Set working directory inside the container
WORKDIR /app

# Dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the current directory contents into the container at /app
COPY ./api /app

# Run your API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]