
// root.cz
if (document.title.toLowerCase().indexOf("root.cz") != -1) {
  hideByName('ad-skyscraper-sticky-holder');
  // hideByName('adibb');
}

function hideById(id) {
  document.getElementById(name).style.display = 'none';
}

function hideByName(name) {
  var elements = document.getElementsByClassName(name);
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = 'none';
  }
}

