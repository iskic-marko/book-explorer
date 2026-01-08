from rest_framework.views import exception_handler
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return None

    error_code = 'error'
    if response.status_code == status.HTTP_400_BAD_REQUEST:
        error_code = 'validation_error'
    elif response.status_code == status.HTTP_401_UNAUTHORIZED:
        error_code = 'authentication_error'
    elif response.status_code == status.HTTP_403_FORBIDDEN:
        error_code = 'permission_denied'
    elif response.status_code == status.HTTP_404_NOT_FOUND:
        error_code = 'not_found'

    if isinstance(response.data, dict) and 'detail' in response.data:
        message = str(response.data['detail'])
        details = None
    elif isinstance(response.data, dict):
        message = 'Validation failed'
        details = response.data
    else:
        message = str(response.data)
        details = None

    response.data = {
        'success': False,
        'error': {
            'code': error_code,
            'message': message,
            'details': details,
        }
    }

    return response
