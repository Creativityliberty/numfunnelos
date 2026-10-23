FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js ./
RUN mkdir -p /app/sessions
EXPOSE 3001
ENV PORT=3001 NODE_ENV=production SESSIONS_DIR=/app/sessions
CMD ["node", "server.js"]
