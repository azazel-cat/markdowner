'use babel';

import MarkdownerView from './markdowner-view';
import { CompositeDisposable } from 'atom';

export default {

  markdownerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.markdownerView = new MarkdownerView(state.markdownerViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.markdownerView.getElement(),
    //   visible: false
    // });

    this.modalPanel = atom.workspace.addOpener((uri) => {
      if (uri === "atom://markdowner") {
        return new MarkdownerView();
      }
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'markdowner:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.markdownerView.destroy();
  },

  serialize() {
    return {
      markdownerViewState: this.markdownerView.serialize()
    };
  },

  toggle() {
    console.log('Markdowner was toggled!');
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
    atom.workspace.toggle('atom://markdowner');
  }

};
