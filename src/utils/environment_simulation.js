//添加图例数据
export function Tuli(data) {
  console.error('addLegenddata', data)
  // console.log(id.children()[0]);
  var id = $('#newtuli')
  var datacolor = data.value[0].colorInfo
  var background = 'linear-gradient(to bottom,'
  id.append('<div id= "newtuli_back" class= "newtuli_back">  </div>')
  // <div class="Legend">
  // 		<span v-for="(item, index) in Legend_data" :key="index" style="text-indent:-0.5vh;font-weight:bold;">
  //      <span style="color:#000;margin-right:1vh;">-</span>
  //      {{item.value}}
  //    </span>
  // </div>
  id.append('<div class="Legend"></div>')
  $('#newtuli_back').append('<span class="newtuli_text">' + -22 + '</span>')
  var span = `
          <span style="text-indent:-0.5vh;font-weight:bold;">
            <span style="color:#000;margin-right:1vh;">-</span>
            ${data.value[0].unit}
          </span>
        `
  $('.Legend').append(span)
  var valueinval = parseInt(datacolor.length / 8)
  for (var i = 0; i < datacolor.length; i++) {
    var colorValue = {
      rgb:
        'rgb(' +
        datacolor[i].R +
        ',' +
        datacolor[i].G +
        ',' +
        datacolor[i].B +
        ')',
      startLevel: parseInt(datacolor[i].startLevel)
    }
    if (i % valueinval == 0) {
      $('#newtuli_back').append('<span class="newtuli_text">' + -22 + '</span>')
      // <span style="text-indent:-0.5vh;font-weight:bold;"></span>
      var span = `
          <span style="text-indent:-0.5vh;font-weight:bold;">
            <span style="color:#000;margin-right:1vh;">-</span>
            ${colorValue.startLevel}
          </span>
        `
      $('.Legend').append(span)
    }
    background += colorValue.rgb + ','
    if (i == datacolor.length - 1) {
      background += colorValue.rgb
      if (i % valueinval == 0) {
      } else {
        $('#newtuli_back').append(
          '<span class="newtuli_text">' + colorValue.startLevel + '</span>'
        )
      }
    }
  }
  console.log(background)
  $('#newtuli_back').css('background', background + ')')
}

export function flatnessTuli(data) {
  let old = document.getElementById('flatnesstuli')
  if (old) document.body.removeChild(old)
  let dom = document.createElement('div')
  dom.className = 'flatnesstuli'
  dom.id = 'flatnesstuli'
  document.body.appendChild(dom)
  var id = $('#flatnesstuli')
  // id.setAttribute("v-if",this.$store.state.erMenu==="flatnessAnalysis")
  console.log(id)
  id.append('<div id=' + data[0].element + '></div>')
  var obox = $('#' + data[0].element + '')
  obox.append('<div class="flatnesstuli_top">平坦度分析图例<hr/></div>')
  var datacolor = data[0].colorInfo
  for (var i = 0; i < datacolor.length; i++) {
    var colorValue = {
      rgb:
        'rgb(' +
        datacolor[i].R +
        ',' +
        datacolor[i].G +
        ',' +
        datacolor[i].B +
        ')',
      startLevel: datacolor[i].startLevel,
      element: datacolor[i].element,
      endLevel: datacolor[i].endLevel
    }
    obox.append(
      '<div class="flatnesstuli_box"><p class="flatnesstuli_color" style="background:' +
        colorValue.rgb +
        '"></p><div class="flatnesstuli_text"><p >' +
        colorValue.startLevel +
        '</p>°~<p>' +
        colorValue.endLevel +
        '</p>°</div></div>'
    )
    // items.append('<div class="flatnesstuli_right"><p class="flatnesstuli_text">' + colorValue.startLevel + '</p></div>');
  }
}

export function sebantuTuli(data) {
  console.log(data)
  let old = document.getElementById('sebantuTuli')
  if (old) document.body.removeChild(old)
  let dom = document.createElement('div')
  dom.className = 'sebantuTuli'
  dom.id = 'sebantuTuli'
  document.body.appendChild(dom)
  var id = $('#sebantuTuli')
  // id.setAttribute("v-if",this.$store.state.erMenu==="flatnessAnalysis")
  console.log(id)
  id.append('<div id=' + data[0].element + '></div>')
  var obox = $('#' + data[0].element + '')
  obox.append('<div class="sebantuTuli_top">色斑图图例<hr/></div>')
  obox.append('<div id="text"></div>')
  var textbox = $('#text')
  textbox[0].style.display = 'flex'
  var textbox_ = document.createElement('div')
  textbox_.id = 'textbox'
  textbox_.style.width = '10px'
  textbox_.style.height = '200px'

  var unitbox = document.createElement('div')
  unitbox.id = 'unitbox'
  unitbox.style.width = '10px'
  unitbox.style.height = '200px'

  var datacolor = data[0].colorInfo
  var RGB = []
  var text = []
  var colorLength
  if (datacolor.length >= 15) {
    colorLength = 25
  }
  if (data[0].element == 't2') {
    colorLength = 25
  }
  let backColor = document.createElement('div')
  backColor.className = 'sebantutuli_top'
  backColor.style.width = '40px'
  backColor.style.height = '200px'
  console.log(datacolor)
  for (var i = 0; i < datacolor.length; i++) {
    if (i % colorLength === 0) {
      console.log(i)
      // debugger
      var colorValue = {
        rgb:
          'rgb(' +
          datacolor[i].R +
          ',' +
          datacolor[i].G +
          ',' +
          datacolor[i].B +
          ')',
        startLevel: datacolor[i].startLevel,
        element: datacolor[i].element,
        endLevel: datacolor[i].endLevel
      }
      RGB.push(colorValue.rgb)
      text.push(colorValue.startLevel)
      let div = document.createElement('div')
      div.className = 'sebantutuli_bottom'
      let span = document.createElement('p')
      span.className = 'sebantuTuli_text'
      span.innerHTML = parseInt(colorValue.startLevel)
      div.append(span)
      textbox_.append(div)
      let div_ = document.createElement('div')
      div_.className = 'sebantutuli_right'
      let unit_ = document.createElement('p')
      unit_.className = 'sebantuTuli_unit'
      unit_.innerHTML = '℃'
      div_.append(unit_)
      unitbox.append(div_)
      //textbox_.append('<div class="flatnesstuli_bottom"><p class="sebantuTuli_text">' + colorValue.startLevel + '</p></div>');
    }
    // debugger
    // text.push(colorValue.startLevel)
  }
  console.log('RGB', RGB.slice(0, 8))
  backColor.style.background = 'linear-gradient(' + RGB + ')'
  // textbox_.style.width = "40px";
  // textbox_.style.height = "200px";
  textbox.append(backColor)
  textbox.append(textbox_)
  textbox.append(unitbox)
  // items.append('<div class="flatnesstuli_right"><p class="flatnesstuli_text">' + colorValue.startLevel + '</p></div>');
  // obox.append('<div class="flatnesstuli_bottom"><p class="sebantuTuli_text">' + colorValue.startLevel + '</p></div>');
}

export function getAngleDescribe(number) {
  var describe
  if (number >= 11.26 && number < 33.75) {
    describe = number + '°-北东北-NNE'
  } else if (number >= 33.75 && number < 56.25) {
    describe = number + '°-东北-NE'
  } else if (number >= 56.25 && number < 78.75) {
    describe = number + '°-东东北-ENE'
  } else if (number >= 78.75 && number < 101.25) {
    describe = number + '°-东-E'
  } else if (number >= 101.25 && number < 123.75) {
    describe = number + '°-东东南-ESE'
  } else if (number >= 123.75 && number < 146.25) {
    describe = number + '°-东南-SE'
  } else if (number >= 146.25 && number < 168.75) {
    describe = number + '°-南东南-SSE'
  } else if (number >= 168.75 && number < 191.25) {
    describe = number + '°-南-S'
  } else if (number >= 191.25 && number < 213.75) {
    describe = number + '°-南西南-SSW'
  } else if (number >= 213.75 && number < 236.25) {
    describe = number + '°-西南-SW'
  } else if (number >= 236.25 && number < 258.75) {
    describe = number + '°-西西南-WSW'
  } else if (number >= 258.75 && number < 281.25) {
    describe = number + '°-西-W'
  } else if (number >= 281.25 && number < 303.75) {
    describe = number + '°-西西北-WNW'
  } else if (number >= 303.75 && number < 326.25) {
    describe = number + '°-西北-NW'
  } else if (number >= 326.25 && number < 348.75) {
    describe = number + '°-北西北-NNW'
  } else {
    describe = number + '°-北-N'
  }
  return describe
}

export function getFileType(type) {
  var str = ''
  if (type == '.xls') {
    str = 'application/vnd.ms-excel'
  } else if (type == '.xlsx') {
    str = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  } else if (type == '.csv') {
    str = 'text/csv'
  } else if (type == '.doc') {
    str = 'application/msword'
  } else if (type == '.docx') {
    str =
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  } else if (type == '.pdf') {
    str = 'application/pdf'
  } else if (type == '.ppt') {
    str = 'application/vnd.ms-powerpoint'
  } else if (type == '.pptx') {
    str =
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  } else if (type == '.png') {
    str = 'image/png'
  } else if (type == '.gif') {
    str = 'image/gif'
  } else if (type == '.jpeg') {
    str = 'image/jpeg'
  } else if (type == '.jpg') {
    str = 'image/jpg'
  } else if (type == '.mp3') {
    str = 'audio/mpeg'
  } else if (type == '.aac') {
    str = 'audio/aac'
  } else if (type == '.html' || type == '.htm') {
    str = 'text/html'
  } else if (type == '.css') {
    str = 'text/css'
  } else if (type == '.js' || type == '.mjs') {
    str = 'text/javascript'
  } else if (type == '.json') {
    str = 'application/json'
  } else if (type == '.abw') {
    str = 'application/x-abiword'
  } else if (type == '.arc') {
    str = 'application/x-freearc'
  } else if (type == '.avi') {
    str = 'video/x-msvideo'
  } else if (type == '.azw') {
    str = 'application/vnd.amazon.ebook'
  } else if (type == '.bin') {
    str = 'application/octet-stream'
  } else if (type == '.bmp') {
    str = 'image/bmp'
  } else if (type == '.bz') {
    str = 'application/x-bzip'
  } else if (type == '.bz2') {
    str = 'application/x-bzip2'
  } else if (type == '.csh') {
    str = 'application/x-csh'
  } else if (type == '.eot') {
    str = 'application/vnd.ms-fontobject'
  } else if (type == '.epub') {
    str = 'application/epub+zip'
  } else if (type == '.ico') {
    str = 'image/vnd.microsoft.icon'
  } else if (type == '.ics') {
    str = 'text/calendar'
  } else if (type == '.jar') {
    str = 'application/java-archive'
  } else if (type == '.jsonld') {
    str = 'application/ld+json'
  } else if (type == '.mid' || type == '.midi') {
    str = 'audio/midi audio/x-midi'
  } else if (type == '.mpeg') {
    str = 'video/mpeg'
  } else if (type == '.mpkg') {
    str = 'application/vnd.apple.installer+xml'
  } else if (type == '.odp') {
    str = 'application/vnd.oasis.opendocument.presentation'
  } else if (type == '.ods') {
    str = 'application/vnd.oasis.opendocument.spreadsheet'
  } else if (type == '.odt') {
    str = 'application/vnd.oasis.opendocument.text'
  } else if (type == '.oga') {
    str = 'audio/ogg'
  } else if (type == '.ogv') {
    str = 'video/ogg'
  } else if (type == '.ogx') {
    str = 'application/ogg'
  } else if (type == '.otf') {
    str = 'font/otf'
  } else if (type == '.rar') {
    str = 'application/x-rar-compressed'
  } else if (type == '.rtf') {
    str = 'application/rtf'
  } else if (type == '.sh') {
    str = 'application/x-sh'
  } else if (type == '.svg') {
    str = 'image/svg+xml'
  } else if (type == '.swf') {
    str = 'application/x-shockwave-flash'
  } else if (type == '.tar') {
    str = 'application/x-tar'
  } else if (type == '.tif' || type == '.tiff') {
    str = 'image/tiff'
  } else if (type == '.ttf') {
    str = 'font/ttf'
  } else if (type == '.txt') {
    str = 'text/plain'
  } else if (type == '.vsd') {
    str = 'application/vnd.visio'
  } else if (type == '.wav') {
    str = 'audio/wav'
  } else if (type == '.weba') {
    str = 'audio/webm'
  } else if (type == '.webm') {
    str = 'video/webm'
  } else if (type == '.webp') {
    str = 'image/webp'
  } else if (type == '.woff') {
    str = 'font/woff'
  } else if (type == '.woff2') {
    str = 'font/woff2'
  } else if (type == '.xhtml') {
    str = 'application/xhtml+xml'
  } else if (type == '.xml') {
    str = 'text/xml'
  } else if (type == '.xul') {
    str = 'application/vnd.mozilla.xul+xml'
  } else if (type == '.zip') {
    str = 'application/zip'
  } else if (type == '.3gp') {
    str = 'video/3gpp'
  } else if (type == '.3g2') {
    str = 'video/3gpp2'
  } else if (type == '.7z') {
    str = 'application/x-7z-compressed'
  } else {
    str = ''
  }
  return str
}

export function uploadByPieces({ file, pieceSize, data, callback }) {
  // console.log(file)
  // 上传过程中用到的变量
  const chunkSize = pieceSize * 1024 * 1024 // 1MB一片
  const chunkCount = Math.ceil(file.size / chunkSize) // 总片数
  const getChunkInfo = (file, currentChunk, chunkSize) => {
    let start = currentChunk * chunkSize
    let end = Math.min(file.size, start + chunkSize)
    let chunk = file.slice(start, end)
    return chunk
  }
  // 针对每个文件进行chunk处理
  const readChunk = () => {
    // 针对单个文件进行chunk上传
    const chunk = getChunkInfo(file, 0, chunkSize)
    uploadChunk({ chunk, currentChunk: 0, chunkCount })
  }
  const uploadChunk = (chunkInfo) => {
    let fetchForm = new FormData()
    fetchForm.append('file', chunkInfo.chunk)
    fetchForm.append('dataJson', data)
    callback(fetchForm)
    chunkInfo.currentChunk++
  }
  readChunk() // 开始执行代码
}
