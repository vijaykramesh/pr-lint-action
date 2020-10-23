FROM node:15.0.0-slim

# Labels for GitHub to read your action
LABEL "com.github.actions.name"="PR Lint Action"
LABEL "com.github.actions.description"="Lint PRs to ensure they contain a ticket and more!"
LABEL "com.github.actions.icon"="book-open"
LABEL "com.github.actions.color"="blue"

# Copy the package.json and package-lock.json
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install --frozen-lockfile --non-interactive

# Copy the rest of your action's code
COPY . .

# Run `node /index.js`
ENTRYPOINT ["node", "/index.js"]
