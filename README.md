# Uploading manually to Netlify using Netlify CLI

### Install the dependencies

```sh
1. yarn add -D netlify-cli
2. yarn add -D @netlify/plugin-nextjs
```

### Create a Netlify.toml file

This should be created inside your project's root directory

```sh
[[plugins]]
package = "@netlify/plugin-nextjs"

[build]
command = "yarn next build"
publish = ".next"
```

### Configure environment variables

```sh
1. set NETLIFY_AUTH_TOKEN=YOUR_TOKEN
2. set NETLIFY_SITE_ID=YOUR_SITE_ID
3. netlify deploy --build --prod
```
