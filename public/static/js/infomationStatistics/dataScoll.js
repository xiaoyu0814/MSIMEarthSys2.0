 // 数字滚动
 function numInit() {
  let HTMLCollection= document.getElementsByClassName('counter-value')
     for (let i = 0; i < HTMLCollection.length; i++) {
         const element = HTMLCollection[i];
         element.style.setProperty("Counter", 0);
         element.classList.add('swing'); 
         element.animate({
            Counter:element.textContent
         },{
            duration:25000,
            // easing: 'swing',
            step:function(now){
                element.textContent = now.toFixed(0)
            }
         })
     }
//   $('.counter-value').each(function(){
//   $(this).prop('Counter',0).animate({
//       Counter: $(this).text()
//   },{
//       duration: 2500,
//       easing: 'swing',
//       step: function (now){
//       $(this).text(now.toFixed(0));
//       }
//   });
//   });
}
function numInit1() {
  $('.counter-value1').each(function(){
  $(this).prop('Counter',0).animate({
      Counter: $(this).text()
  },{
      duration: 2500,
      easing: 'swing',
      step: function (now){
      $(this).text(now.toFixed(1));
      }
  });
  });
}
function numInit2() {
  $('.counter-value2').each(function(){
  $(this).prop('Counter',0).animate({
      Counter: $(this).text()
  },{
      duration: 2500,
      easing: 'swing',
      step: function (now){
      $(this).text(now.toFixed(2));
      }
  });
  });
}