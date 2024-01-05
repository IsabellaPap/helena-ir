FROM python:3.12


RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the current directory contents into the container at /app
COPY ./api /app
COPY start.sh /app/start.sh

CMD ["/app/start.sh"]