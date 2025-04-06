# Code Snippets
## Kit File Template
```html
<!DOCTYPE html>
<html lang="en-US">

<head>
    <!-- @include "global/head.kit"-->
    <title>Dirty Napkin | Page Name</title>
</head>

<body>
    <!-- @include "global/header.kit" -->

    <main>
        <!-- @include "global/footer.kit" -->
         
    </main>
    <!-- @import "global/scripts.kit"-->

</body>

</html>
```

## Responsive Images
```html
<picture>
  <source
    media=”(min-width: 1024px)”
    srcset=”/assets/window_lockup_lg.png” />
  <source
    media=”(min-width: 576px)”
    scrset=”/assets/window_lockup_sm.png” />
  <img src=”/assets/window_lockup_min.png” alt=”Window logo lockup”>
</picture>
```

## Detect When An Element Comes Into View (JS)
```js
if (target) observer.observe(target);
```