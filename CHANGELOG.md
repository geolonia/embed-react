# Changelog

## [1.2.0] - 2021-10-08

### 追加

* カスタムコントロールを追加するためのコンポーネント `<GeoloniaMap.Control />` を追加しました

## [1.1.0] - 2021-10-03

### 追加

* `mapRef` を扱いやすくするために型を `geolonia.Map` から `geolonia.Map | null` に変更
* `lat` `lng` `zoom` の props に変更があった時に `flyTo` やマーカーの更新を行うようになりました
* `mapStyle` の props に変更があった時に `setStyle` で地図スタイルの変更を行うようになりました
* `<GeoloniaMap ...props>contents</GeoloniaMap>` の `contents` に動的な React コンポーネントツリーを使えるようになりました

## [1.0.0] - 2021-09-28

### 追加

* イニシャルリリース
