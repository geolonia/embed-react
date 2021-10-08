# Geolonia Maps Embed for React

[![npm](https://img.shields.io/npm/v/@geolonia/embed-react?style=flat-square)](https://www.npmjs.com/package/@geolonia/embed-react) [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/geolonia/embed-react/build?style=flat-square)](https://github.com/geolonia/embed-react/actions/workflows/build.yml)

[Geolonia Maps](https://geolonia.com/maps/) の地図を React のアプリケーションに埋め込むためのライブラリー。

[デモや使い方を見る](https://geolonia.github.io/embed-react/?path=/story/geoloniamap--defaults)

## インストール

```shell
npm install --save @geolonia/embed-react
```

```shell
yarn add @geolonia/embed-react
```

## 使い方

```jsx
import { GeoloniaMap } from '@geolonia/embed-react';

const Page = () => {
  return <>
    <h1>私の地図</h1>
    <GeoloniaMap
      apiKey="YOUR-API-KEY"
      style={{height: "200px", width: "100%"}}
      lat="35.681236"
      lng="139.767125"
      zoom="16"
    />
  </>
}
```

Geolonia Maps をご自身のサイトに表示させるために API キーが必要となります。[詳しくはこちらをお読みください。](https://docs.geolonia.com/tutorial/002/)

## Embed API と の違い

Embed API は `data-*` アトリビュートで引数を渡していますが、 React インテグレーションは `data-*` がありません。例えば、 `data-lat="35"` の代わりに、 `lat="35"` で指定してください。 `-` で別れている言葉があれば camelCase でつなげてください。(例： `data-navigation-control` が `navigationControl` になります)

また、 React や JavaScript の制約上制限されている属性名が変わります。下記の表を参照しにしてください。

| Embed API の属性 | Embed React の props 名 |
| --------------- | ----------------------- |
| `data-style="geolonia/basic"` | `mapStyle="geolonia/basic"` |
| `data-3d="on"`  | `render3d="on"` |

`embed-react` は使用するコンポーネントがマウントされる時に Embed API の JavaScript が読み込まれているかを確認し、読み込まれていない場合は動的に追加します。もしサイトのほとんどのページに Geolonia Maps 地図を埋め込む場合は、テンプレートの `index.html` に埋め込むことをおすすめします。[サンプルを確認する](https://github.com/geolonia/maps.geolonia.com/blob/4e431e466db71af7b4181129b3a8408ae91cd028/public/index.html#L26)

## カスタムコントロールを追加する

`<GeoloniaMap.Control />` を使うと、独自の[コントロール](https://maplibre.org/maplibre-gl-js-docs/api/markers/#icontrol)を地図に追加することができます。

```jsx
import { GeoloniaMap } from '@geolonia/embed-react';

const Page = () => {
  return <>
    <GeoloniaMap style={{height: "200px", width: "100%"}}>
      <GeoloniaMap.Control containerProps={ { className: 'maplibregl-ctrl' } }>
        <button>{'ボタン'}</button>
      </GeoloniaMap.Control>
    </GeoloniaMap>
  </>
}
```

| props | type |
| --------------- | ----------------------- |
| position? | `"top-left" \| "top-right" \| "bottom-right" \| "bottom-left"` |
| onAdd? | `maplibregl.IControl['onAdd']` |
| onRemove? | `maplibregl.IControl['onRemove']` |
| containerProps? | `{ className?: string }` |

## 注意

現在のバージョンでは、 `GeoloniaMap` の props が変わると地図の再レンダリングが行われません。

下記の props が変わる時に動的に変更を受け付けています。

* `lat`, `lng`, `zoom`
  * マーカーが表示されているときはマーカーの位置を変更し、地図の中央点を新しい `lat`, `lng`, `zoom` に飛びます。
* `mapStyle`
