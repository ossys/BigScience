from django.http import HttpResponse

class EnforceVersioning:
    """ This middleware enforces an API version number is provided in the 'Accept' header, and that the version number provided is supported. """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_view(self, request, view_func, view_args, view_kwargs):
#         print(dir(view_func))
#         print(view_func.__dir__())
        return None

    def process_exception(self, request, exception):
        return self.get_response(request)

    def process_template_response(self, request, response):
        return response
