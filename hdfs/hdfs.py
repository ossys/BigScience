import redis
from hdfs3 import HDFileSystem

print('>>>>>>>> CONNECTING TO HDFS >>>>>>>>>')
hdfs = HDFileSystem(host='localhost', port=9000)
print('>>>>>>>> CONNECTING TO REDIS >>>>>>>>>')
r = redis.StrictRedis(host='localhost', port=6379, db=0)
 
def writeChunk(user, chunk):
    print('>>>>>>>> WRITING CHUNK >>>>>>>>')
