# Node.js JWT with passport example

## start server

```sh
 npm install
 node index.js
```

## Use curl to test

```sh
curl -X POST -H "Content-Type:application/json" localhost:3000/login -d '{"account":"user1","password":"%2yx4"}'
```

```json
{
    "message": "ok",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY2Mzk5MjMwfQ.6tcu_gG_BBjW2nshtv5xlS1w-9LWCSI5KL0X5uhLu5M"
}
```

```sh
curl localhost:3000/secret -H "Authorization:JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY2Mzk5MjMwfQ.6tcu_gG_BBjW2nshtv5xlS1w-9LWCSI5KL0X5uhLu5M"
```

```
"Success! You can not see this without a token"
```
