# HTML Include
`htmlInclude` is an easy way to include reusable elements in your html without any backend code.

## Install
Copy the `htmlInclude.min.js` file under the `src` directory into your projects and include the following `<script>` tag to load `htmlInclude`.

```js
<!-- Minified -->
<script src="link/to/htmlInclude.min.js"></script>
```
## Usage
---
### Initialization
Before elements can be converted, you should first initialize `htmlInclude` after the html has loaded.

```html
<script>
    htmlInclude.init()
</script>
```

### Tag:
```html
<include src="./link/to/include.html"></include>
```
The `<include>` tag must have a `src` attribute that links to the html code you want to replace.

> **Note**
> I know custom html elements should contain a `"-"` but i dont any problems using it as is. If there are any problems please let me know. 

### Props:
Props allow you to pass string values to the html you want to include by adding `"$prop_name"`.

`./include.html`
```html
<!--  ./include.html -->
<article class="card-of-$type">
    <h1> $title </h1>
    <p> $description </p>
</article>
```
In the example above `$type`, `$title` and `$description ` props has been declared. to pass values to the `include.html` all we do is set attributes of the same name in the `<include>` tag.

`./index.html`
```html
<!--  ./index.html -->
<include
    src="./include.html"

    type="loggedin"
    title="User is Signed In"
    description="Please make sure you have 2 factor authentication"
></include>
```

### Mode:
The `init()` function accepts a single argument `mode` that specifies how the include elements should be used.

By default `mode` is set to `"tag"`, this tells  `htmlInclude` to look for a `<include>` tag.

```html
<include src="./link/to/include.html"></include>

<script>
    htmlInclude.init()
</script>
```

The `"attribute"` `mode` can be used for when you want a particular element to change or have a styled element as a placeholder while the include is being retrieved.

```html
<div 
    include
    src="./link/to/include.html"

    class="loadinging-animation">

    Loading Component...
    
</div>

<script>
    htmlInclude.init('attribute')
</script>

```

## Reserved Attribute Names
---
The follow list of attributes should not be used as `props` in `<include>` tags:
* src
* select
* attribute
* html-include
* include
* fragment
* cache
* cached

## Example
---
> See example under the projects `./examples/include-basic.html`.



## Up Coming Features
---
* `(Priority)` Caching include responses.
* Ability to get related .css and .js files according to each include.
* Nested includes.
* Ability to pass html to the include. Example:
```html
<!--  ./index.html -->
<include src="./link/to/include.html">

    <h1 fragment="title_fragment" class='active-title'>
        Only for logged in users
    </h1>

</include>
```

```html
<!--  ./link/to/include.html -->
<div class="status">
    <img src="" alt="">

    %title_fragment

    <p>
        Notification: Please reset all passwords.
    </p>

</div>

```