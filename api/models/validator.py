class Validator:
    MISSING_FIELDS='missing_fields'
    INVALID_FIELDS='invalid_fields'
    DATABASE_ERROR='database_error'
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

    def hasDuplicate(self, field=None, value=None): pass

    def hasErrors(self):
        return bool(self.errors)

