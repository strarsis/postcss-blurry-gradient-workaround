# PostCSS Blurry Gradient Workaround

[PostCSS] plugin that splits gradients with too many explicit end-stops into separate gradients as workaround for blurry gradients in some browsers..

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
    /* Input example */
	background: 
		linear-gradient(to right,
		  green        10%,                   /*   no explicit start-stop,  1st explicit end-stop */
		  yellowgreen  10%, yellowgreen  20%, /*  1st explicit start-stop,  2nd explicit end-stop */
		  yellow       20%, yellow       30%, /*  2nd explicit start-stop,  3rd explicit end-stop */
		  orange       30%, orange       40%, /*  3rd explicit start-stop,  4th explicit end-stop */
		  red          40%, red          50%, /*  4th explicit start-stop,  5th explicit end-stop */
		  grey         50%, grey         60%, /*  5th explicit start-stop,  6th explicit end-stop */
		  blue         60%, blue         70%, /*  6th explicit start-stop,  7th explicit end-stop */
		  green        70%, green        70%, /*  7th explicit start-stop,  8th explicit end-stop (triggers bug) */
		  yellowgreen  70%, yellowgreen  80%, /*  8th explicit start-stop,  9th explicit end-stop */
		  yellow       80%, yellow       90%, /*  9th explicit start-stop, 10th explicit end-stop */
		  salmon       90%                    /* 10th explicit start-stop,   no explicit end-stop */);
}
```

```css
.foo {
  /* Output example */
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

[official docs]: https://github.com/postcss/postcss#usage
