# Excalidraw Collaboration Server

[![Create and publish Docker images](https://github.com/AidanSchmitigal/Excalidraw/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/AidanSchmitigal/Excalidraw/actions/workflows/docker-publish.yml)

This is a fork of [excalidraw](https://github.com/excalidraw/excalidraw) and [excalidraw-room](https://github.com/excalidraw/excalidraw-room) and [excalidraw-storage-backend](https://gitlab.com/kiliandeca/excalidraw-storage-backend) with some modifications.

## Usage

There is a docker-compose.yml file in the root directory, with all the required services.
To run the server, run:

```bash
docker compose up
```

The server will be available at http://localhost:3200.

## Parts

### excalidraw

This is the main excalidraw application, it is a fork of [excalidraw](https://github.com/excalidraw/excalidraw). Modifications were made to add support for a non-firebase storage backend, and a bootleg Excalidraw+ style room browser & share menu.

The storage backend is taken from [Kilian's excalidraw-fork](https://gitlab.com/kiliandeca/excalidraw-fork) and [alswl's excalidraw-fork](https://github.com/alswl/excalidraw)

#### Environment Variables

> Note: These environment variables are staticly replaced the first time the docker container is run. This is because Vite statically builds the Excalidraw website and therefore doesn't support dynamic environment variables. To change these variables, you'll need to rebuild the container.

| Name                           | Description                                                                    | Default value                       |
| ------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------- |
| `VITE_APP_BACKEND_V2_GET_URL`  | The URL to the excalidraw-storage-backend API endpoint to get the scene data.  | `http://localhost:8082/api/v2`      |
| `VITE_APP_BACKEND_V2_POST_URL` | The URL to the excalidraw-storage-backend API endpoint to post the scene data. | `http://localhost:8082/api/v2/post` |
| `VITE_APP_WS_SERVER_URL`       | The URL to the excalidraw-room server.                                         | `http://localhost:8084`             |

### excalidraw-storage-backend

This is a fork of [excalidraw-storage-backend](https://github.com/excalidraw/excalidraw-storage-backend) with some modifications to add file based storage instead of a database and a api route to list all the rooms.

#### Environment Variables

| Name            | Description                                            | Default value |
| --------------- | ------------------------------------------------------ | ------------- |
| `PORT`          | Server listening port                                  | 8082          |
| `GLOBAL_PREFIX` | API global prefix for every routes                     | `/api/v2`     |
| `LOG_LEVEL`     | Log level (`debug`, `verbose`, `log`, `warn`, `error`) | `warn`        |
| `BODY_LIMIT`    | Payload size limit for scenes or images                | `50mb`        |

### excalidraw-room

This is [excalidraw-room](https://github.com/excalidraw/excalidraw-room). It is setup as a fork to allow for future modifications to the room server.

#### Environment Variables

| Name          | Description                        | Default value |
| ------------- | ---------------------------------- | ------------- |
| `PORT`        | Server listening port              | 8084          |
| `CORS_ORIGIN` | CORS origins to allow for requests | \*            |
