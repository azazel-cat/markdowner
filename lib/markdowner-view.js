'use babel';

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import mermaid from 'mermaid';

export default class MarkdownerView {

  constructor(serializedState) {
    mermaid.initialize({ startOnLoad: false })

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('markdowner');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The Markdowner package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);

    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem((item) => {
      if (!atom.workspace.isTextEditor(item)) {
        message.innerText = 'Open a markdown file to preview.';
        return;
      }

      if (item.buffer.file.path.split('.').pop() != 'md') {
        message.innerText = 'File does not appear to be markdown. Save with "md" extension to preview.'
        return;
      }

      const renderer = {
        code({ lang, text }) {
          if (lang == 'mermaid') {
            return `
              <pre class="mermaid">${mermaid.render('graphDiv', text)}</pre>
            `;
          } else {
            return `
              <pre><code>${text}</code></pre>
            `;
          }
        }
      };

      marked.use({ renderer });

      message.innerHTML = `
        ${DOMPurify.sanitize(marked.parse(item.buffer.cachedText), {
          ADD_TAGS: ['foreignObject'],
          HTML_INTEGRATION_POINTS: {'foreignobject': true}
        })}
      `;
    });
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Markdowner View';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://markdowner';
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'bottom';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['left', 'right', 'bottom'];
  }

}
