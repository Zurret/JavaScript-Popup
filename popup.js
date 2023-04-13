/**
 * 
 * MIT License
 * 
 * Copyright (c) 2022 Zurret
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
// Generate a popup window using an existing div
function generatePopup(title, content, x = null, y = null) {
  // Remove any potentially harmful HTML tags from title and content
  const titleHtml = title ? title.replace(/(<([^>]+)>)/gi, '') : 'Popup';
  const contentHtml = content.replace(/(<([^>]+)>)/gi, '');

  // If Title OR Content is empty, return
  if (!titleHtml || !contentHtml) {
    return;
  }

  if (x !== null && y !== null) {
    // Set Windows.event.x and .y to the x and y values
    window.event.x = x;
    window.event.y = y;
  }

  const popupIdName = 'overDiv';
  let isDown = false;
  // If popupIdName div already exists, remove it
  const popup = document.getElementById(popupIdName) || document.createElement('div');
  popup.id = popupIdName;
  popup.style.position = 'absolute';
  popup.style.zIndex = '111111112';
  document.body.appendChild(popup);
  // set popup title and content
  popup.innerHTML = `<div id="popup-title">${titleHtml} <span class="popup-close">X</span></div><div id="popup-content">${contentHtml}</div>`;
  // set popup title and content html elements
  const popupTitle = document.getElementById('popup-title');
  const popupContent = document.getElementById('popup-content');
  // Set Popup Width and Height
  const popupWidth = Math.min(popupContent.offsetWidth + 20, window.innerWidth * 0.6);
  const popupHeight = Math.min(popupContent.offsetHeight + 20, window.innerHeight * 0.6);
  // Set Style for Popup Elements
  // popup
  Object.assign(popup.style, {
    backgroundColor: '#000000',
    border: '1px solid #333333',
    boxShadow: '0px 0px 1px #000000',
    top: (window.event.y) - (popupHeight / 2) + 'px',
    left: (window.event.x) - (popupWidth / 2) + 'px',
    width: popupWidth + 'px',
    height: popupHeight + 'px',
    maxWidth: '100%',
    maxHeight: '100%'
  });
  // popupTitle
  Object.assign(popupTitle.style, {
    backgroundColor: '#212121',
    borderBottom: '1px solid #333333',
    color: '#D99D1C',
    padding: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    userSelect: 'none',
    display: 'block',
    lineHeight: '1.2',
    verticalAlign: 'middle'
  });
  // popupContent
  Object.assign(popupContent.style, {
    backgroundColor: '#000000',
    color: '#a1a1a1',
    padding: '5px',
    fontSize: '12px',
    display: 'block'
  });
  // popupClose
  const popupClose = document.getElementsByClassName('popup-close')[0];
  Object.assign(popupClose.style, {
    cursor: 'pointer',
    float: 'right',
    backgroundColor: '#73241f',
    border: '1px solid #8f2821',
    color: '#a88d8d',
    fontWeight: 'bold',
    padding: '3px 6px',
    marginTop: '-4px',
    marginRight: '-4px'
  });
  // Set Event Listeners
  popupClose.addEventListener('mouseover', function () {
    Object.assign(popupClose.style, {
      backgroundColor: '#8f2d27',
      border: '1px solid #962018',
      color: '#fafafa'
    });
  });
  popupClose.addEventListener('mouseout', function () {
    Object.assign(popupClose.style, {
      backgroundColor: '#73241f',
      border: '1px solid #8f2821',
      color: '#a88d8d'
    });
  });
  popupClose.addEventListener('click', function () {
    popup.remove();
  });
  popupTitle.addEventListener('mousedown', function () {
    popup.style.cursor = 'move';
    isDown = true;
    document.body.style.userSelect = 'none';
  });
  popupTitle.addEventListener('mouseup', function () {
    popup.style.cursor = 'default';
    isDown = false;
    document.body.style.userSelect = 'text';
  });
  document.addEventListener('mousemove', function (event) {
    if (isDown) {
      popup.style.top = (event.y) - (popupTitle.offsetHeight / 2) + 'px';
      popup.style.left = (event.x) - (popupTitle.offsetWidth / 2) + 'px';
      // Fix popup position if it goes out of the screen
      if (popup.offsetTop < 0) {
        popup.style.top = 0;
      }
      if (popup.offsetLeft < 0) {
        popup.style.left = 0;
      }
      if (popup.offsetTop + popup.offsetHeight > window.innerHeight) {
        popup.style.top = window.innerHeight - popup.offsetHeight + 'px';
      }
      if (popup.offsetLeft + popup.offsetWidth > window.innerWidth) {
        popup.style.left = window.innerWidth - popup.offsetWidth + 'px';
      }
    }
  });
}

// Generate Popup Window for the given url
async function generatePopupWindow(url) {
  const x = window.event.x;
  const y = window.event.y;
  if (url.indexOf(window.location.host) !== -1 || url.substring(0, 1) === '/') {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const html = await response.text();
        const title = html.match(/<title>(.*?)<\/title>/)[1];
        // remove potentially harmful HTML tags from content
        const content = html.replace(/<script.*?<\/script>/g, '');
        // generate popup with title and content and windows.event.x and windows.event.y
        generatePopup(title, content, x, y);
      } else {
        alert('Error: ' + response.status);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  } else {
    alert('Error: Invalid URL');
  }
}
