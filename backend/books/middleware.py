import logging
import time

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = int((time.time() - start_time) * 1000)
        user = request.user.username if request.user.is_authenticated else 'anonymous'
        
        logger.info(
            f"{request.method} {request.path} {response.status_code} {duration}ms user={user}"
        )
        
        return response
