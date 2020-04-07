
// ----------------------------------------------------------------------------
// Domains
// ----------------------------------------------------------------------------

// root.cz
if (document.title.toLowerCase().indexOf("root.cz") != -1) {
  hideByClassName('ad-skyscraper-sticky-holder');
  // hideByClassName('adibb');
}

// simpsonovi.nikee.net
if (document.title.toLowerCase().indexOf("nikee") != -1) {
  hideByTagName('td', 5);
}

// nahnoji.cz
if (document.title.toLowerCase().indexOf("nahnoji.cz") != -1) {

  // Try hide element in 5th, 6th, 7th, 8th and 9th second
  for (var i = 5; i < 10; i++) {
    setTimeout(function() {
      hideById('video_advert');
    }, i * 1000);
  }
}

// ----------------------------------------------------------------------------
// Functions
// ----------------------------------------------------------------------------

function hideById(id) {
  var element = document.getElementById(id);
  if (element) {
    element.style.display = 'none';
  }
}

function hideByClassName(name) {
  var elements = document.getElementsByClassName(name);
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = 'none';
  }
}

function hideByTagName(tagName, pos) {
  var tags = document.getElementsByTagName(tagName);
  if (tags[pos]) {
    tags[pos].style.display = 'none';
  }
}

