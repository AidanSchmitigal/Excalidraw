# Excalidraw Collaboration Server

This is a fork of [excalidraw](https://github.com/excalidraw/excalidraw) and [excalidraw-room](https://github.com/excalidraw/excalidraw-room) and [excalidraw-storage-backend](https://gitlab.com/kiliandeca/excalidraw-storage-backend) with some modifications.

## Usage

There is a docker-compose.yml file in the root directory, but there are no prebuilt images yet.

To build the images, run:

```bash
docker-compose build
```

To run the server, run:

```bash
docker-compose up
```

The server will be available at http://localhost:3204.
