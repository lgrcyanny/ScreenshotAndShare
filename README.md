ScreenshotAndShare
==================

This is an Chrome extension. The application is to take screenshot and share to social network, like renren, weibo.

Installation
================
```sh
$ git clone git@github.com:lgrcyanny/ScreenshotAndShare.git
```
install from chrome "Load unpacked extension"

Architecture
=====
1.Screenshot Function<BR>
+ popup.js: handle the popup menu, trigger the screenshot functions
+ background.js: it's the pivot controller, handle the screenshot function, post image to screenshot.html
+ page-inject.js: inject in web pages, catch user actions, show screenshot selection area
+ page-inject-shortcut.js: catch user shortcut actions, send messages to background.js
+ screenshot.js: the js is in screenshot.html, show image,  handle the download function

2.Renren share<BR>
+ renren-share.js: in screenshot.html, catch user's share activition
+ renren-inject.js: inject in renren oauth redirect uri page, catch the access_token info, send to renren-background.js
+ renren-background.js: the chrome backgoud js, in charge of seeding pictures to renren, redirect to renren home page

3.Weibo share<BR>
+ weibo-share.js: in screenshot.html, catch user's share activition
+ weibo-inject.js: inject in weibo oauth redirect uri page, catch the access_token info, send to weibo-background.js
+ weibo-background.js: the chrome backgoud js, in charge of seeding pictures to weibo, redirect to weibo home page

