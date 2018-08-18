import os
import configparser
config = configparser.ConfigParser()
config.read(os.path.join(os.path.abspath(os.path.dirname(__file__)), 'settings.ini'))
for section in config:
    for key in config[section]:
        os.environ[key.upper()] = config[section][key]
 
from app import app
from tasks import tasking
import multiprocessing

from aoiklivereload import LiveReloader
reloader = LiveReloader()

p = multiprocessing.Process(target=tasking.worker_main, args=(['bigscience', '--loglevel=INFO'],))

def start():
    reloader.start_watcher_thread()
    p.start()
    app.run(host='127.0.0.1', port=8000, debug=True)

def stop():
    p.terminate()

reloader.set_on_stop(stop)

if __name__ == '__main__':
    exit(start())
