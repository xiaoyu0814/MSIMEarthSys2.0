const fs = require('fs')
const pdf = require('html-pdf')

// HTML文件路径
const htmlPath =
  'd:/proj2025/gfdx/MSIMEarthSysGFDX1.1.3/public/static/事件说明文档.html'
// PDF输出路径
const pdfPath =
  'd:/proj2025/gfdx/MSIMEarthSysGFDX1.1.3/public/static/事件说明文档.pdf'

// 读取HTML文件内容
const htmlContent = fs.readFileSync(htmlPath, 'utf8')

// PDF生成选项
const options = {
  format: 'A4',
  orientation: 'portrait',
  border: {
    top: '1cm',
    right: '1cm',
    bottom: '1cm',
    left: '1cm'
  }
}

// 转换HTML为PDF
pdf.create(htmlContent, options).toFile(pdfPath, (err, res) => {
  if (err) {
    console.error('转换失败:', err)
    process.exit(1)
  }
  console.log('转换成功:', res.filename)
})
