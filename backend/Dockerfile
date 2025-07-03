# Use slim Python image
FROM python:3.11-slim

# Install FFmpeg and required dependencies
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Start the Flask app with gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
