import re

class Validator:
    MISSING_FIELDS  ='missing_fields'
    INVALID_FIELDS  ='invalid_fields'
    DATABASE_ERROR  ='database_error'
    DUPLICATE_ERROR ='duplicate_error'
    INVALID_AUTH    ='invalid_auth'

    errors = None

    def __init__(self):
        self.errors = {}

    def hasRequiredFields(self, required_fields=[], json={}):
        for field in required_fields:
            if not field in json:
                self.addMissingField(field)

    def addMissingField(self, field):
        if Validator.MISSING_FIELDS not in self.errors:
            self.errors[Validator.MISSING_FIELDS] = []
        self.errors[Validator.MISSING_FIELDS].append(field)

    def addInvalidField(self, field, message):
        if Validator.INVALID_FIELDS not in self.errors:
            self.errors[Validator.INVALID_FIELDS] = []
        self.errors[Validator.INVALID_FIELDS].append({"field": field, "message": message})

    def addDatabaseError(self, error):
        if Validator.DATABASE_ERROR not in self.errors:
            self.errors[Validator.DATABASE_ERROR] = []
        self.errors[Validator.DATABASE_ERROR].append(error)

    def addDuplicateError(self, error):
        if Validator.DUPLICATE_ERROR not in self.errors:
            self.errors[Validator.DUPLICATE_ERROR] = []
        self.errors[Validator.DUPLICATE_ERROR].append({
            "field": error.__dict__['_OperationFailure__details']['errmsg'].split('index:')[1].split('_')[0].strip(),
            "value": re.findall(r"\{(.*?)\}", error.__dict__['_OperationFailure__details']['errmsg'])[0].replace('"', '').replace(':', '').strip()
        })

    def invalidAuth(self, value):
        if Validator.INVALID_AUTH not in self.errors:
            self.errors[Validator.INVALID_AUTH] = value

    def hasErrors(self):
        return bool(self.errors)
