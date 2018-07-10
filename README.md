# Requirements

NodeJS / Angular
``

Anaconda
``

# Install Dependencies

Angular
`npm install`

Django App
`conda env create -f environment.yml`

# Start Services

Angular Front-End
`ng serve`

Celery Worker
`celery -A BigScience worker -l info`

REST Server
`python manage.py runserver`