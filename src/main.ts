import { MarkdownView, Plugin } from "obsidian";

export default class VariablesMD extends Plugin {
  async onload() {
    this.registerEvent(metadataCacheChangeEvent(this));
    this.registerMarkdownCodeBlockProcessor("var", (source, el, _ctx) => {
      let file = this.app.workspace.getActiveFile();
      if (file) {
        this.app.fileManager.processFrontMatter(file, (frontmatter) => {
          let newSource = source.replaceAll(
            /\{\{([^\}]*)\}\}/g,
            (match, p1) => {
              return p1 in frontmatter ? frontmatter[p1] : match;
            },
          );

          // Construct a copy of the code block element with modified content
          let div = el.createDiv();
          let first = div.createDiv({
            cls: [
              "HyperMD-codeblock",
              "HyperMD-codeblock-begin",
              "HyperMD-codeblock-begin-bg",
              "HyperMD-codeblock-bg",
              "cm-line",
            ],
            attr: { dir: "ltr" },
          });
          first.createEl("img", {
            cls: "cm-widgetBuffer",
            attr: { "aria-hidden": "true" },
          });
          first.createSpan({ attr: { contenteditable: "false" } });
          first.createEl("img", {
            cls: "cm-widgetBuffer",
            attr: { "aria-hidden": "true" },
          });
          first.createSpan({
            cls: "code-block-flair",
            attr: { "aria-label": "Copy", contenteditable: "false" },
          });
          first.createEl("img", {
            cls: "cm-widgetBuffer",
            attr: { "aria-hidden": "true" },
          });

          let second = div.createDiv({
            cls: ["HyperMD-codeblock", "HyperMD-codeblock-bg", "cm-line"],
          });
          second.createSpan({
            text: newSource,
            cls: "cm-hmd-codeblock",
            attr: { spellcheck: "false" },
          });

          let third = div.createDiv({
            cls: [
              "HyperMD-codeblock",
              "HyperMD-codeblock-bg",
              "HyperMD-codeblock-end",
              "HyperMD-codeblock-end-bg",
              "cm-line",
            ],
          });
          third.setAttribute("dir", "ltr");
          third.createEl("img", {
            attr: { "aria-hidden": "true" },
            cls: "cm-widgetBuffer",
          });
          third.createSpan({ attr: { contenteditable: "false" } });
          third.createEl("img", {
            attr: { "aria-hidden": "true" },
            cls: "cm-widgetBuffer",
          });
        });
      }
    });
  }

  onunload() {}
}

const metadataCacheChangeEvent = (plugin: VariablesMD) =>
  plugin.app.metadataCache.on("changed", (path, _, _cache) => {
    const activeFile = plugin.app.workspace.getActiveFile();
    if (activeFile && activeFile === path) {
      let view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
      if (view) {
        let editor = view.editor;
        let text = editor.getValue();
        editor.replaceRange(
          text,
          editor.offsetToPos(0),
          editor.offsetToPos(text.length),
        );
      }
    }
  });
