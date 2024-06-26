# PostCSS Blurry Gradient Workaround

[PostCSS] plugin that splits gradients with too many explicit end-stops into separate gradients as workaround for blurry gradients in some browsers..

[PostCSS]: https://github.com/postcss/postcss

[Demo for issue and workaround.](https://codepen.io/strarsis/pen/MWbxWMw)

```css
.foo {
    /* Input example */
    background:
        /* apply-gradient-stops-workaround */
        linear-gradient(to right,
          green        10%,
          yellowgreen  10%, yellowgreen  20%,
          yellow       20%, yellow       30%,
          orange       30%, orange       40%,
          red          40%, red          50%,
          grey         50%, grey         60%,
          blue         60%, rgba(255,0,0,0) 70%,
          green        70%, green        70%,
          yellowgreen  70%, yellowgreen  80%,
          yellow       80%, yellow       90%,
          salmon       90%);
}
```

```css
.foo {
  /* Output example */
    background:
        /* apply-gradient-stops-workaround */
        linear-gradient(to right,
          green        10%,
          yellowgreen  10%, yellowgreen  20%,
          yellow       20%, yellow       30%,
          orange       30%, orange       40%,
          red          40%, red          50%,
          grey         50%, grey         60%,
          blue         60%, rgba(255,0,0,0) 70%) , linear-gradient(to right , transparent 70%,
          green        70%, green        70%,
          yellowgreen  70%, yellowgreen  80%,
          yellow       80%, yellow       90%,
          salmon       90%);
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-blurry-gradient-workaround
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-blurry-gradient-workaround'),
    require('autoprefixer')
  ]
}
```

**Step 4:** Enable plugin for specific gradients.
Put the annoation in front of the gradient function:
```css
.test {
  background: /* apply-gradient-stops-workaround */ linear-gradient(red, blue, yellow, grey, green, red, blue, yellow, grey, green, red, blue, yellow, grey, green);
}
````

[official docs]: https://github.com/postcss/postcss#usage

## Options
### stopsLimit
Number of stops that are allowed in a gradient.
The gradient blurriness issue is triggered with 8 or more explicit end-stops.
This means 2*8 overall stops, which is also the plugin default.

