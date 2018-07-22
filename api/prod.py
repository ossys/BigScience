from app import app
import multiprocessing

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, workers=multiprocessing.cpu_count())
