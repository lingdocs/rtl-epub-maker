# RTL EPUB Maker

Easily create EPUB e-book files with proper RTL support.

This is a web app that uses [pandoc](https://pandoc.org) to create .epub files for e-books in RTL languages. Making RTL e-books can be tricky. This tries app tries to simplify the process as much as possible, so that anyone can make them.

[Try it live - RTL EPUB Maker](https://rtl-epub-maker.lingdocs.com)

## Running

You can run this app on your own machine or host it on a server.

### With Node

requires:

- Node.js 12.22.0 or later
- [pandoc](https://pandoc.org/installing.html)

To run in dev mode:

```sh
npm install
npm run dev
```

To host in production:

```sh
npm run build
npm run start
```

### With Docker

If you are using `linux/amd64` architecture you can just run the [the docker image](https://hub.docker.com/r/lingdocs/rtl-epub-maker).

```sh
docker compose up
```

If you are using an architecture other than `linux/amd64` you will need to build your own Docker image.

```sh
docker build . -t rtl-epub-maker
docker run -p 127.0.0.1:3001:3001 rtl-epub-maker
```

## Serving

The app will be served on `http://localhost:3001`. Add a reverse proxy with SSL if you want to serve it to the world.

---

Code is licensed under a [MIT License](https://github.com/lingdocs/rtl-epub-maker/blob/master/LICENSE). Contributions are welcome.
