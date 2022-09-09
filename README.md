# Thea
Tea management system

## Running
### Bare metal
TODO

### Docker compose

#### Docker-compose.yaml
```
version: "3.9"
services:
  web:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./storage/:/app/storage/
    env_file:
      - .env

```
#### .env 

```
MQTT__HOST=test.com
MQTT__PORT=1883
MQTT__USERNAME=user
MQTT__PASSWORD=password
MQTT__TOPIC=Thea/Tea

Storage__Type=SQLLITE
Storage__Path=storage/db/
Storage__Username=user
Storage__Password=password
```

## License

Icone: <a href="https://www.flaticon.com/free-icons/hot-chocolate" title="hot chocolate icons">Hot chocolate icons created by Us and Up - Flaticon</a>
