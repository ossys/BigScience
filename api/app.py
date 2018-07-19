from sanic import Sanic
from sanic_cors import CORS, cross_origin

from controllers import user, file, chunk

app = Sanic()
CORS(app)

PREFIX = '/api'

# user
app.add_route(user.register, user.prefix(PREFIX) + '/register', methods=['POST', 'OPTIONS'])
app.add_route(user.login, user.prefix(PREFIX) + '/login', methods=['POST', 'OPTIONS'])

# file
app.add_route(file.prepare, file.prefix(PREFIX) + '/prepare')

# chunk
app.add_route(chunk.upload, chunk.prefix(PREFIX) + '/upload')
