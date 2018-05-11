function log(msg) {
  const control = $('#log');
  control.html(control.html() + msg + '<br/>');
  control.scrollTop(control.scrollTop() + 1000);
}