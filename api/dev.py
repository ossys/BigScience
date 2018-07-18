import configparser
from app import app

from aoiklivereload import LiveReloader
  
reloader = LiveReloader()
reloader.start_watcher_thread()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
