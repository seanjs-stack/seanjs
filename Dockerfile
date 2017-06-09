FROM node:4.2.3

# Install gem sass for grunt-contrib-sass
RUN apt-get update -qq && apt-get install -y build-essential
RUN apt-get install -y ruby
RUN apt-get install -y libssl-dev ruby
RUN gem install sass

WORKDIR /home/seanjs

# Install SEAN.JS Prerequisites
RUN npm install -g grunt-cli && npm install -g bower

# Install SEAN.JS packages
ADD package.json /home/seanjs/package.json
#RUN npm install

# Manually trigger bower
ADD .bowerrc /home/seanjs/.bowerrc
ADD bower.json /home/seanjs/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /home/seanjs

# Set development environment as default
ENV NODE_ENV development
ENV NODE_HOST 192.168.99.100

# Environment for redis
ENV REDIS_HOST 192.168.99.100

# Environment for postgres database
ENV DB_HOST 192.168.99.100
ENV DB_PORT 5432
ENV DB_NAME seanjs_dev
ENV DB_USERNAME postgres
ENV DB_PASSWORD postgres
ENV DB_DIALECT postgres

# Port 5432 for postgres
# Port 3000 for server
# Port 35729 for livereload

EXPOSE 5432 3000 35729

CMD ["grunt"]
