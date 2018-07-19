class JSONResponse:
    success: False
    data: None
    message: None
    errors: None

    def __init__(self, success=False, data=None, message=None, errors=None):
        self.success = success
        self.data = data
        self.message = message
        self.errors = errors

    def dict(self):
        d =  {}

        if self.success is not None:
            d['success'] = self.success

        if self.data is not None:
            d['data'] = self.data

        if self.message is not None:
            d['message'] = self.message

        if self.errors is not None:
            d['errors'] = self.errors

        return d
