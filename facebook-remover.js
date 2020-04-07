function removeParent(tag, levels) {
  for (var i = 0; i < levels; i++) {
    tag = tag.parentNode;
  }

  // tag.style.background = 'red';
  // console.log('remove ' + tag);

  // Remove from feed
  tag.parentNode.removeChild(tag);
}

function facebookRemover(event) {
  let elements = {
    'a': {
      'textContent': 'Sponzorováno',
      'parentLevel': 14
    },
    'span': {
      'textContent': 'Návrhy pro vás',
      'parentLevel': 13
    }
  };

  for (var key in elements) {
    var tags = document.getElementsByTagName(key);
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].textContent == elements[key]['textContent']) {
        console.log('[facebook] remove ' + tags[i].textContent);
        removeParent(tags[i], elements[key]['parentLevel']);
      }
    }
  }
}

window.onload = function(event) {
  setInterval(facebookRemover, 2500);
}
