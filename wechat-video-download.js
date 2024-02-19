try {
  let body = $response.body
  body = body.replace(
    '</body>', `
        <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
        <script>eruda.init();</script>
        <script src="https://i.wantmake.love:8091/wechat-video-download/wechat-video-download.inject.js?t=${new Date().getTime()}"></script>
        </body>
    `)
  $done({body})
} catch (e) {
  $done({})
}