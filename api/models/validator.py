import re

class Validator:
    INVALID_TYPES       ='invalid_types'
    EXCEPTIONS          ='exceptions'
    MISSING_FIELDS      ='missing_fields'
    INVALID_FIELDS      ='invalid_fields'
    DATABASE_ERROR      ='database_error'
    DUPLICATE_ERROR     ='duplicate_error'
    MISSING_TOKEN       ='missing_token'
    INVALID_TOKEN       ='invalid_token'
    INVALID_AUTH        ='invalid_auth'
    INVALID_USER        ='invalid_user'
    INVALID_ROLE        ='invalid_role'
    PERMISSION_ERROR    ='permission_error'

    errors = None

    def __init__(self):
        self.errors = {}

    def invalidType(self, field, message):
        if Validator.INVALID_TYPES not in self.errors:
            self.errors[Validator.INVALID_TYPES] = []
        self.errors[Validator.INVALID_TYPES].append({"field": field, "message": message})

    def hasRequiredFields(self, required_fields=[], json={}):
        for field in required_fields:
            if not field in json:
                self.addMissingField(field)

    def addException(self, message):
        if Validator.EXCEPTIONS not in self.errors:
            self.errors[Validator.EXCEPTIONS] = []
        self.errors[Validator.EXCEPTIONS].append(message)

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

    def missingToken(self):
        if Validator.MISSING_TOKEN not in self.errors:
            self.errors[Validator.MISSING_TOKEN] = True

    def invalidToken(self, message):
        if Validator.INVALID_TOKEN not in self.errors:
            self.errors[Validator.INVALID_TOKEN] = message

    def invalidUser(self, message):
        if Validator.INVALID_USER not in self.errors:
            self.errors[Validator.INVALID_USER] = message

    def invalidRole(self):
        if Validator.INVALID_ROLE not in self.errors:
            self.errors[Validator.INVALID_ROLE] = True

    def permissionError(self, message):
        if Validator.PERMISSION_ERROR not in self.errors:
            self.errors[Validator.PERMISSION_ERROR] = message

    def hasErrors(self):
        return bool(self.errors)
