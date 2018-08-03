import os
import configparser
from app import app
from aoiklivereload import LiveReloader

config = configparser.ConfigParser()
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)), 'settings.ini'))

for section in config:
    for key in config[section]:
        os.environ[key.upper()] = config[section][key]

reloader = LiveReloader()
reloader.start_watcher_thread()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
