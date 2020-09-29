# Deck.gl & 2.5次元マップデモ

![](https://github.com/ichiwaki-altlas/cadix-deckgl/blob/master/public/image01.png?raw=true)

## 概要

Deck.glを用いた2.5次元マップで設備データを表現したデモアプリ

背景地図には公開することを想定し、TOWN-IIではなくOpenStreetMapのデータを用いることとする。

## 準備
### ツール入手

osm2pgsqlを入手

https://learnosm.org/ja/osm-data/osm2pgsql/

### データ入手

下記サイトより日本の地方単位で入手可能

http://download.geofabrik.de/asia/japan.html



### PostgreSQLにインポート

#### データベース準備

```sql
CREATE DATABASE osm_chubu
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
```

#### 作成したデータベースでPostGIS有効化

```sql
CREATE EXTENSION postgis;
```

#### osm2pgsql実行

```
osm2pgsql -c -d osm_chubu -U postgres -H localhost -P 5433 -W -S C:\Users\ichiw\Downloads\default.style C:\Users\ichiw\Downloads\chubu-latest.osm.pbf
```

※上記コマンドのデータベース接続系のパラメータは環境によって要書き換え

### アプリケーション

#### クライアントアプリケーション

https://github.com/ichiwaki-altlas/cadix-deckgl

```
npm i
yarn start
```

#### サーバーアプリケーション

https://github.com/ichiwaki-altlas/cadix-vectortile-server

(README参照)

※サーバーアプリケーションは3000番で起動、クライアントアプリケーションは8080番で起動するようになっている

※両方の起動が必要
