FROM python:3.8

WORKDIR /code

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000


CMD [ "python", "-m","frontend_service.circuit_wrapper_service" ]