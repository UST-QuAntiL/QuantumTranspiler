

class Config(object):
    API_TITLE = "QuantumTranspiler API"
    API_VERSION = "1.0"
    OPENAPI_VERSION = "3.0.2"
    OPENAPI_URL_PREFIX = "/api"
    OPENAPI_SWAGGER_UI_PATH = "/swagger-ui"
    OPENAPI_SWAGGER_UI_VERSION = "3.24.2"
    OPENAPI_SWAGGER_UI_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.24.2/"

    API_SPEC_OPTIONS = {
        "info": {
            "description": "This is the API Specification of the QuantumTranspiler",
        },
        "license": {"name": "Apache v2 License"},
    }
