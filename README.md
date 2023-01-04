# DockerAndKubernetes

## Commands Cheatsheet

- docker run -i -t debian /bin/bash
	-  to get a shell of the container
- docker ps 
	-  to get the list of running containers and their names
- docker ps -a 
	- for list of all containers that were created including the stopped ones
- docker inspect <container name> | grep IPAddress
	- to get the info about the container inspect it!
- docker diff <container name>
	- to get changes we have done on that container
- docker rm <container name>
	- to get rid of container
- docker rm -v $(docker ps -aq -f status=exited) 
	-  to remove all the exited containers from history
- docker logs <docker name> 
	- to get all the logs for the container
- docker commit <containername> <repo name>/<image name>
	- eg: docker commit cowsay test/cowsayimage
- docker image ls
	- list all the docker images
- docker container ls --all  
	- list the docker containers
- docker build -t <image name>
	-  to build a docker image using specified name from Dockerfile
	- -f can be mentioned to provide dockerfile name incase we are using dev dockerfile
- docker run -p 4000:80 <containername>
	-  port mapping 4000 machine port to 80 of container exposed
- docker run <containername> npm run test
	-  Whatever we mention in the CMD can be overwritten by sending the command options in the last.
- docker run -d -p 4000:80 <containername> 
	-  to run on background use -d
- docker tag <containername> rohitpothuri/get-started:part2 
	- docker tag image username/repository:tag
- docker push username/repository:tag 
	-  to Upload your tagged image to the repository
- docker system prune  
	-  cleanup all stopped containers, cache, dangling images and all networks not used
- docker exec -it <container id> <command to run> 
	- to run a command on a running container
	- - i means attach terminal to the standard input so input can be passed to the docker
	- -t is to prettify stuff in output
- docker exec -it <container id> sh
	- open a terminal in existing running container


- docker stack ls # List stacks or apps
- docker stack deploy -c <composefile> <appname>  # Run the specified Compose file
- docker service ls # List running services associated with an app
- docker service ps <service> # List tasks associated with an app
- docker inspect <task or container> # Inspect task or container
- docker container ls -q # List container IDs
- docker stack rm <appname> # Tear down an application
- docker swarm leave --force # Take down a single node swarm from the manager
---

## Docker File Creation


```
#Using existing docker image as base
FROM alpine

#Download and install dependencies
RUN apk add --update  redis

#Tell the image what to do when it starts as a container
CMD [ "redis-server" ]
```

After we create the above dockerFile. we will build it using docker build command

This will build the docker file and create an image with an id eg(ec27497b3f68272228bf9e99388210087ab022571c6b447f3be8d97e6fa38084) shown in the above image

- FROM 
	- Tell us which base image to use
- RUN
	- Once we have the base image container, whatever is mentioned in the run command is executed and here we are going to install Redis. A temporary container is used to installed all this and once it is done we saving the file snaphost.
- CMD
  - Once we have an image with Redis installed, we are telling which command to run. This will be the primary command for the container. This final image is what will be used to start the docker container.

In short whenever we move from one step to another a temporary container is created, a FS snapshot is created and passed to the next step as image. In the last step we get the final image that is eventually used. In our case the id of that image is ec27497b3f68272228bf9e99388210087ab022571c6b447f3be8d97e6fa38084

- WORKDIR
	- can be used to fix a working directory in Dockerfile
- COPY
	- is used to copy the files from the local file system to the container file system
	Since the change of files sometimes can trigger cache build, its better to carefully validate and split the files to multiple steps i.e files that wont change much should be copied first and files that change a lot and are not dependent of container builds can be moved to the last

```
#Using existing docker image as base
FROM alpine

#Download and install dependencies
RUN apk add --update  redis
RUN apk add --update  gcc

#Tell the image what to do when it starts as a container
CMD [ "redis-server" ]
```
	
When we add a new gcc installation step here and run docker build command, Docker intelligently uses the cache it has built earlier to get the image from "RUN apk add --update  redis" step and uses that instead of building a new container from the first step i.e from alpine. So whenever we make change in the dockerFile we only run from the changed step instead of running from the beginning. The order of commands also matter here. If we move gcc command first, it will only use the alpine image cache instead of redis image cache

To run the above image we use docker run <id>
Using id is cumbersome, we can give a name to the docker using the below command
docker build -t <dockerid>/<repo/project name>:<version> .
eg: docker build -t rpothuri/redis:latest .

we can now run the above image using docker run rpothuri/redis[:version]. version is optional. If not mentioned it uses latest.


We can use the existing images to modify them and install new things. For example
docker run -it alpine sh
- This gives shell of the alpine container
- Once we have the shell we can do  --> apk add --update  redis-
- This will install redis
	Now we can exit of the container, get the id of it using docker ps
We commit the changes we have done to the container to be used next time
	docker commit -c 'CMD ["redis-server"]' <docker id> 
when we mention the id we dont have to mention the full long id, we can get first few chars as long as it is unique.


---
## Docker Compose 
Always run the command in the directory where we have compose file
Uses the yaml file and will take care of the build and run

- docker-compose up 
	 - this is the command to use to start the containers. to run it on background use "-d"
- docker-compose up  -- build
	- to rebuild the container.
- docker-compose down
	- stops all the containers that were started using docker compose
- docker-compose ps
	- used to find all running containers after startup	

---
## Restart Policies
changes are done to compose file
- "no"
	- default.Dont restart on failures. This has to be added in quotes if specifiying explicity as 'no'
- "always"
	 - always attempt to restart for any failure.
- "on-failure"
	- Only restart if the container stops with an error code
- "unless-stopped"
	- Always restart unless we forcibly stop it

---
# Production Grade workflows
npx create-react-app frontend
Dockerfile.dev can be used for development environment

---

## Docker Volumes
- Used to map paths in local to paths in the container so we dont have to build the image everytime there is a change in the app code
- docker run -p [local port]:[container port] -v /app/node_modules -v ${PWD}:/app [image id]
	- When we  use a : we are saying map everything in the local directory with a folder inside the container
	- when we dont have a : i.e in -v /app/node_modules, we are saying to consider it only as a place holder in the container and dont try to map it with anything else
	-  All these can be mentioned in the docker compose file instead of useing the long docker run command. see docker compose file inside frontend app

## Build Phases

	
	
	


