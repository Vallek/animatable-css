# Animatable and not animatable CSS properties

This page contains lists of animatable and not animatable css properties. There [was](https://web.archive.org/web/20230131022559/https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties) a list like this on MDN but it was removed (see [discussion here](https://github.com/mdn/content/issues/27042)), so I decided to make one) I'd like to thank @yarusome and @Josh-Cena for replying and providing a link to the W3C api.

This page is not affiliated with W3C or MDN. However it uses W3C [open API](https://github.com/w3c/webref) to get all the data from specifications.

Some values may differ between W3C api and any other sources (including MDN and specs themselves). There are also multiple [Levels](https://www.w3.org/TR/CSS/#css-levels) of same specs where same properties also may differ. Always check different sources and test it yourself!

The point of this page is to be fully automated without need for manual edits. It updates once a day. If you don't see any properties (this means build failed) or if you found any other problem please create an issue.

Disclaimer: this is my first Node.js project)

I didn't want to put too much strain on API or client side. So I decided to generate a static html once a day on timer. It's done with Github Actions.

If you have any suggestions please contact me or make a Pull Request.

[How to use](https://vallek.github.io/webdevtips/en/build-static-node-github-actions) this method of building page yourself.