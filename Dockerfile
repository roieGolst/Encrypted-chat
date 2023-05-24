FROM alpine
COPY . ecp
RUN apk add --update nodejs
RUN apk add --update npm
RUN npm install --global yarn
WORKDIR /ecp
RUN yarn install
CMD yarn run bas