let code_fill_str = ['000000', '00000', '0000', '000', '00', '0', '']
let code = '' + parseInt(Math.random() * 1000000)
code = code_fill_str[code.length] + code

export default code
