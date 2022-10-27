// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const axios = require("axios");

// vscode token: rxkqqq73vwsalxvrov2gppqektilndyevgk4m3intz6dzu57sqoa

/**
 * 获取文章列表
 */
const fetchArticleList = async () => {
  const res = await axios.post(
    "https://immortalboy.cn/api/blog/articlelist/getArticleList",
    { limit: 1000, offset: 0, type: "全部" }
  );
  let list = [];
  if (res.status === 200 && res.data.success) {
    list = res.data.data.list.map((item) => ({
      label: item.title,
      detail: item.introduce,
      link: `https://immortalboy.cn/article-detail/${item.id}`,
    }));
  }
  return list;
};

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // 获取所有文章
  const allArticles = await fetchArticleList();

  let disposable = vscode.commands.registerCommand(
    "immortalboy-cn-blog-list.listAllArticles",
    async function () {
      const article = await vscode.window.showQuickPick(allArticles, {
        matchOnDetail: true,
      });
      if (article == null) {
        return;
      }

      vscode.env.openExternal(article.link);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
