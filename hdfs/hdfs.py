from hdfs3 import HDFileSystem
from celery import shared_task

print('>>>>>>>> CONNECTING TO HDFS >>>>>>>>>')
hdfs = HDFileSystem(host='localhost', port=9000)

@shared_task
def writeChunk(user, chunk):
    chunk.save()
    print('WRITE CHUNK: ' + chunk.sha256)
#         username = 'ccravens'
#         if not HDFS.hdfs.exists('/' + username):
#             HDFS.hdfs.mkdir('/' + username)
#         if chunk.file.sha256 not in HDFS.files:
#             print('>>>>>>>> OPENING FILE >>>>>>>> ' + chunk.file.sha256)
#             HDFS.files[chunk.file.sha256] = HDFS.hdfs.open('/ccravens/' + chunk.file.sha256 , 'wb', 0, 0, 0)
#         else:
#             print('>>>>>>>> REUSING FILE HANDLE >>>>>>>>>')
#         print('>>>>>>>> WRITING CHUNK >>>>>>>> ' + chunk.sha256)
#         HDFS.files[chunk.file.sha256].write(chunk.data)
#         HDFS.files[chunk.file.sha256].flush()
