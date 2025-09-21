FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize the sandbox
WORKDIR /home/user/nextjs-app

RUN npx --yes create-next-app@latest . --yes 

RUN npx --yes shadcn@latest init --yes -b neutral --force
RUN npx --yes shadcn@latest add --all --yes

# Move the Nextjs app to the home directory and remove the nextjs-app directory
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app
