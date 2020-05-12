function removeParent(tag, levels) {

  // tag is the element with advertisment and should be removed. It's parent
  // should stay.
  for (var i = 0; i < levels; i++) {
    tag = tag.parentNode;
    if (tag == null) {
      return;
    }

    if (tag.parentNode == null) {
      return;
    }
  }

  if (tag.parentNode.id === 'ad-remover-wrapper') {
    return;
  }

  // tag.style.background = 'red';
  console.log('advertisment tag found: ' + tag.textContent);

  // Remove from feed
  // let parentNode = tag.parentNode;
  // parentNode.removeChild(tag);

  let c = document.createElement('a');
  c.setAttribute('href', 'javascript://');
  c.textContent = 'Skrýt/odkrýt';
  let wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'ad-remover-wrapper');
  wrapper.setAttribute('onclick', 'if (this.lastChild.style.display === "none") { this.lastChild.style.display="block" } else { this.lastChild.style.display="none"; }');
  wrapper.appendChild(c);
  tag.style.display = 'none';
  tag.parentNode.insertBefore(wrapper, tag);
  wrapper.appendChild(tag);
}

function findSequence(node, chars) {
  var index = -1;
  for (var i = 0; i < node.childNodes.length; i++) {
    let child = node.childNodes[i];

    // There are some tags with invisible '-' char
    if (child.style.display == 'none') {
      continue;
    }

    index++;
    // console.log('compare ' + chars[index] + ' with ' + child.textContent);
    if (chars[index] != child.textContent) {
      return false;
    }
  }
  return index > -1;
}

function facebookRemover(event) {
  console.log('searching for advertisment');

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
        removeParent(tags[i], elements[key]['parentLevel']);
      }
    }
  }

  // Parent <b> with 'S' and children <b> in sequence 'ponzorováno'
  let bElements = document.getElementsByTagName('b');
  for (var i = 0; i < bElements.length; i++) {
    if (bElements[i].textContent.replace(/-/g, '') === 'Sponzorováno') {
        console.log('found "Sponzorováno": ' + bElements[i].textContent);
        removeParent(bElements[i], 16);
        continue;
    }
    if (bElements[i].textContent == 'S') {
      console.log('found <b>S</b>');
      if (findSequence(bElements[i].parentNode, 'Sponzorováno')) {
        removeParent(bElements[i].parentNode, 16);
      }
    }
  }
}

function buffer(func, wait) {
  var timeout;
  var debounce;
  var first = true;

  return function() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };

    if (!timeout) {
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }

    clearTimeout(debounce);
    debounce = setTimeout(function() {
      first = true;
    }, wait);
    if (first) {
      first = false;
      func.apply(context, args);
    }
  };
};

window.onload = function(event) {
  document.getElementsByTagName('body')[0].onscroll = buffer(facebookRemover, 1000);
  setTimeout(function() {
    facebookRemover();
  }, 1500);

  // Right column above chat
  setTimeout(function() {
    let divElements = document.getElementsByTagName('div');
    for (var i = 0; i < divElements.length; i++) {
      if (divElements[i].children.length == 0 && divElements[i].textContent === 'Sponzorováno') {
        removeParent(divElements[i], 9);
      }
    }
  }, 1500);
}
