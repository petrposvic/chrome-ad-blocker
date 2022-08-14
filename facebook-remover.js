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

function removeByPun() {
  console.log('searching pun of "Sponzorováno"');
  var buf = '';
  var lastParentId = -1;
  var lastElement = null;
  const divs = document.getElementsByTagName('div');
  for (var i = 0; i < divs.length; i++) {
    const d = divs[i];

    // Ignore already removed
    if (d.parentNode.getAttribute('data-already-removed') === '1') {
      continue;
    }

    // Remove without pun
    if (d.innerHTML.startsWith('Sponzorováno')) {
      console.log('remove "Sponzorováno"');
      d.parentNode.setAttribute('data-already-removed', '1');
      removeParent(d, 21);
      continue;
    }

    const inner = d.innerHTML;
    if (
      inner !== 'S' &&
      inner !== 'p' &&
      inner !== 'o' &&
      inner !== 'n' &&
      inner !== 'z' &&
      inner !== 'r' &&
      inner !== 'v' &&
      inner !== 'á'
    ) continue;

    if (
      d.style['position'] === 'absolute'
    ) continue;

    var parentId = d.parentNode.getAttribute('data-parent-id');
    if (parentId === null) {
      d.parentNode.setAttribute('data-parent-id', i);
      parentId = i;
    }

    if (lastParentId != parentId) {
      console.log('processing new parent ' + parentId + ': ' + buf);

      var target = 'Sponzorováno';
      if (buf.length == target.length) {
        for (var j = 0; j < buf.length; j++) {
          const ch = buf[j];
          const index = target.indexOf(ch);
          if (index > -1) {
            target = target.slice(0, index) + target.slice(index + 1, target.length)
          }
          // console.log('searching for ' + ch + ' and found on index ' + index + ': ' + target);
        }

        if (target === '') {
          console.log('remove ' + buf);
          /*var p = lastElement;
          for (var j = 0; j < 14; j++) {
            p = p.parentNode;
          }
          // p.style.display = 'none';
          // p.style.background = '#f00';*/
          removeParent(lastElement, 27);
        }
      }

      if (lastElement) {
        lastElement.parentNode.setAttribute('data-already-removed', '1');
      }
      buf = '';
    }

    lastParentId = parentId;
    lastElement = d;
    buf += inner;
  }
}

function removeByInnerHtml() {
  console.log('searching inner text "Sponzorováno"');

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

function facebookRemover(event) {
  console.log('searching for advertisment');
  removeByInnerHtml()
  removeByPun();
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
