window.WeixinJSBridge.invoke = (function (name, origin) {
  let videoData = null

  function createDownloadBtn () {
    let btnGroup = document.querySelector('#downloadBtnGroup')
    if (btnGroup) return

    const el = document.querySelector('.feed-card-wrap')
    el.style.cssText = `
      position: relative;
    `

    btnGroup = document.createElement('div')
    btnGroup.id = 'downloadBtnGroup'
    btnGroup.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
    `

    const download = document.createElement('button')
    download.style.cssText = `
      width: 130px;
      height: 30px;
      color: #6c757d;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #6c757d;
    `
    download.innerText = '复制下载链接'
    download.onclick = () => {
      if (videoData?.url) {
        copyToClipboard(
          videoData.url,
          () => {
            showToast('复制下载链接成功')
          }
        )
      }
    }

    const password = document.createElement('button')
    password.style.cssText = `
      width: 130px;
      height: 30px;
      color: #6c757d;
      cursor: pointer;
      border-radius: 4px;
      margin-right: 15px;
      border: 1px solid #6c757d;
    `
    password.innerText = '复制解密秘钥'
    password.onclick = () => {
      if (videoData?.decode_key) {
        copyToClipboard(
          videoData.decode_key,
          () => {
            showToast('复制解密秘钥成功')
          }
        )
      }
    }

    btnGroup.appendChild(password)
    btnGroup.appendChild(download)
    el.appendChild(btnGroup)
    console.log(el)
  }

  function getVideoResponse (response) {
    try {
      if (response?.['err_msg'] !== 'finderH5ExtTransfer:ok') return
      console.log(response)
      const respJson = JSON.parse(response?.['jsapi_resp']?.['resp_json'])
      console.log(respJson)
      const media = respJson?.['object']?.['object_desc']?.['media']?.[0]
      const description = respJson?.['object']?.['object_desc']?.['description']?.trim()
      console.log(media)
      videoData = {
        'decode_key': media?.['decode_key'],
        'url': media?.['url'] + media?.['url_token'],
        'size': media?.['file_size'],
        'description': description,
        'uploader': respJson?.['object']?.['nickname']
      }
      createDownloadBtn()
    } catch (e) {
    }
  }

  function showToast (message, duration = 2000) {
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    color: white;
    z-index: 9999;
    padding: 10px 20px;
    border-radius: 5px;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.5);
  `
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, duration)
  }

  function copyToClipboard (text, success) {
    console.log(text)
    var textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 0;
    height: 0;
  `
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    if (success) success()
  }

  return function () {
    try {
      const cmdName = arguments?.[0]
      const cmdUrl = arguments?.[1]?.url
      if (cmdName === 'finderH5ExtTransfer' &&
        cmdUrl === '/cgi-bin/micromsg-bin/pc_findergetcommentdetail') {
        const original_callback = arguments?.[2]
        arguments[2] = async function () {
          getVideoResponse(arguments?.[0])
          return await original_callback.apply(this, arguments)
        }
      }
    } catch (e) {
      console.error(e)
    }
    return origin.apply(this, arguments)
  }
})('WeixinJSBridge.invoke', window.WeixinJSBridge.invoke)