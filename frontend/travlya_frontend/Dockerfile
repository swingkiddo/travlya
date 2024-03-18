FROM node:20-alpine

WORKDIR /frontend
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV REACT_APP_API_URL="http://travlya.xyz:8000"

CMD ["npm", "start"]