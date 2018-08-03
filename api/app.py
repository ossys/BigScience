from sanic import Sanic
from sanic_cors import CORS

from controllers import user, file, chunk

app = Sanic()
CORS(app)

PREFIX = '/api'

# user
app.add_route(user.register, user.prefix(PREFIX) +  '/register',    methods=['OPTIONS', 'POST'])
app.add_route(user.login, user.prefix(PREFIX) +     '/login',       methods=['OPTIONS', 'POST'])

# file
app.add_route(file.prepare, file.prefix(PREFIX),     methods=['OPTIONS', 'POST', 'GET'])

# chunk
app.add_route(chunk.upload, chunk.prefix(PREFIX),      methods=['OPTIONS', 'POST'])
