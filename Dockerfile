FROM node
    
COPY ./src /src
COPY .env /src
COPY package.json /src
ENV TZ=America/Sao_Paulo


#colocar em variavel de ambiente
EXPOSE 3001
WORKDIR /src
RUN npm install
CMD [ "node","index.js" ]