FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# Remove .env or .config if exists
#RUN rm -f .env
# Install netcat-openbsd for wait functionality
RUN apk add --no-cache netcat-openbsd

# Create a proper wait script
RUN echo '#!/bin/sh' > /wait-for.sh && \
    echo 'while ! nc -z $1 $2; do' >> /wait-for.sh && \
    echo '  echo "Waiting for $1:$2..."' >> /wait-for.sh && \
    echo '  sleep 1' >> /wait-for.sh && \
    echo 'done' >> /wait-for.sh && \
    echo 'echo "$1:$2 is available"' >> /wait-for.sh && \
    echo 'exec $3' >> /wait-for.sh && \
    chmod +x /wait-for.sh

EXPOSE 5000

CMD ["/bin/sh", "-c", "/wait-for.sh 127.0.0.1 3306 'npm start'"]
