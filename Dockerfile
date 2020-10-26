##Nodejs
FROM node:10
RUN useradd --user-group --create-home --shell /bin/false app
ENV HOME=/home/app

COPY package.json package-lock.json $HOME/playerground/
RUN chown -R app:app $HOME/*

USER app 
WORKDIR $HOME/playerground
RUN npm cache clean && npm install --silent --progress=false

USER root
COPY . $HOME/playerground
RUN chown -R app:app $HOME/*
USER app