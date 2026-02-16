## Instal:
```

sudo apt install libwbclient-dev

```


### Commandos

```
#acces command line
docker-compose exec firebird bash

#access  datqbase isql 
CONNECT '/var/lib/firebird/data/mirror.fdb' USER 'maria' PASSWORD 'mariita';

## interactive commands:
SHOW DATABASE;

```
## Ejecucion de Scripts:
-i singifica input file

```

isql -u maria -p mariita /var/lib/firebird/data/mirror.fdb -i ./procedures/create_user.sql

```

## Call Store Procedure:


## Utils
```
SHOW DATABASE;
SHOW PROCEDURES;
EXIT;

```


