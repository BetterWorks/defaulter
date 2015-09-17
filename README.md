# defaulter [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
default profile image generator using up to two initial characters from a text

[read about why we built this](https://engineering.betterworks.com/2015/09/16/on-the-fly-profile-picture/)
or
[try it out live](https://defaulter.betterworks.com/?text=DF)

![sample](https://defaulter.betterworks.com/?text=He&size=100&sample.png)
![sample](https://defaulter.betterworks.com/?text=LL&size=100&sample.png)
![sample](https://defaulter.betterworks.com/?text=O!&size=100&sample.png)
![sample](https://defaulter.betterworks.com/?text=猴&size=100&sample.png)

#### parameters
```
text        -> /?text=di
size        -> /?size=500
color       -> /?hex=123456
seed        -> /?seed=deterministic

mix & match -> /?text=di&size=600&seed=123
            -> /?text=猴&size=1024&hex=ffffe0
```

#### running locally on mac
1. `sudo port install cairo`
2. `npm start` or `node-dev bin/www`

#### custom font
Replace `fonts/font.woff` with a different web font file

#### heroku deployment
1. enable the heroku multi buildpack
2. push to heroku

#### performance
```
Benchmarking defaulter.herokuapp.com (be patient).....done


Server Software:        Cowboy
Server Hostname:        defaulter.herokuapp.com
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-RSA-AES128-GCM-SHA256,2048,128

Document Path:          /?text=FF
Document Length:        Variable

Concurrency Level:      2
Time taken for tests:   1.800 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      122126 bytes
HTML transferred:       77326 bytes
Requests per second:    55.56 [#/sec] (mean)
Time per request:       35.997 [ms] (mean)
Time per request:       17.998 [ms] (mean, across all concurrent requests)
Transfer rate:          66.26 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        6    8   2.0      7      16
Processing:    11   28  13.3     25      70
Waiting:       11   27  13.0     24      69
Total:         18   36  13.8     33      86

Percentage of the requests served within a certain time (ms)
  50%     33
  66%     38
  75%     45
  80%     46
  90%     58
  95%     65
  98%     70
  99%     86
 100%     86 (longest request)
 ```

#### cloudflare
If you use cloudflare in front of defaulter and append `.png` in the url, the cdn will be able to cache the images.

`https://defaulter.betterworks.com/?text=CF&size=100&hex=ffa500&cloudflare.png`
![cached](https://defaulter.betterworks.com/?text=CF&size=100&hex=ffa500&cloudflare.png)
