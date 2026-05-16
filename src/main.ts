import { MarkdownPostProcessorContext, Plugin } from "obsidian";

export default class VariablesMD extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor((element, _context) => {
      // Visit every descendant nodes and modify any {{var}} to var.value
      let file = this.app.workspace.getActiveFile();
      file &&
        this.app.fileManager.processFrontMatter(file, (frontmatter) => {
          this.replaceVariables(element, frontmatter);
        });
    });
  }

  async replaceVariables(node: Node, frontmatter: any) {
    if (node.nodeType === 3 && node.nodeValue) {
      let text = node.nodeValue;
      let newText = text.replaceAll(
        /\{\{([^\}]*)\}\}/g,
        function replacer(match, p1) {
          return p1 in frontmatter ? frontmatter[p1] : match;
        },
      );
      node.nodeValue = newText;
    } else {
      node.childNodes.forEach((node) =>
        this.replaceVariables(node, frontmatter),
      );
    }
  }

  async onunload() {}
}
