# Node.js JWT with passport example

## start server

```sh
 npm install
 node index.js
```

## Use curl to test

```sh
curl -X POST -H "Content-Type:application/json" localhost:3000/login -d '{"account":"user1","password":"12345"}'
```

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY2Mzk5MjMwfQ.6tcu_gG_BBjW2nshtv5xlS1w-9LWCSI5KL0X5uhLu5M"
}
```

```sh
curl localhost:3000/posts -H "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY2Mzk5MjMwfQ.6tcu_gG_BBjW2nshtv5xlS1w-9LWCSI5KL0X5uhLu5M"
```

```json
[
    {
        "id": 1,
        "title": "Hello , how are you ?",
        "author": "Ark",
        "time": "2019-08-08T02:19:56.196Z"
    },
    {
        "id": 2,
        "title": "I'm fine, thank you, and you ?",
        "author": "Bibby",
        "time": "2019-08-08T02:20:06.096Z"
    },
    {
        "id": 3,
        "title": "How's the weather like ?",
        "author": "C.C",
        "time": "2019-08-08T02:21:06.996Z"
    }
]
```
