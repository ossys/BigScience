from celery import Celery

tasking = Celery('bigscience',
             broker='amqp://bigscience:bigscience@localhost/bigscience',
             backend='rpc://',
             include=[])
