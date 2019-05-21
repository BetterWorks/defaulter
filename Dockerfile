FROM node:12

RUN apt-get update && \
  apt-get install -y \
    libcairo2 \
    libjpeg-dev \ 
    libgif-dev \
    fonts-wqy-zenhei

EXPOSE 3000

WORKDIR /app
ADD . /app

RUN npm install

COPY ./fonts/font.woff /usr/share/fonts/
RUN fc-cache -fv

CMD bin/www
