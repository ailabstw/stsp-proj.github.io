const fs = require('fs')
const http = require('http')
const config = require('../config')

module.exports = {
  generate_post(data) {

    data.forEach(e => {
      e.date = e.date.toLocaleDateString()
      var file_name = e.date + "-" + e.name + ".md"
      var data = [
        "---",
        "layout: post",
        "title: " + e.name,
        "description: ",
        "image: ",
        "tags: ['" + e.data_classify + "', '" + e.group + "', '" + e.classify + "']",
        "introduction: " + e.data_comment,
        "---",
        "",
        "# 數據庫名稱: " + e.name,
        "",
        "> 對於此數據庫的描述: <br>",
        "> " + e.data_comment,
        "",
        "## 數據庫詳細資料",
        "",
        "+ 建立日期: " + e.date,
        "+ 數據庫名稱: " + e.name,
        "+ 衛星基地計畫類型: " + e.classify,
        "+ 數據提供單位: " + e.group,
        "+ 數據領域類別: " + e.data_classify,
        "+ 數據檔案類型: " + e.data_type,
        "+ 內容說明: " + e.data_comment,
        "+ 示範應用網站入口: " + e.website
      ].join('\n')

      // fs.writeFile(file_name, data, {
      //     flag: 'w'
      //   }, function (err) {
      //     if (err) console.error(err)
      //     console.log(file_name + " success")
      //   })
    })
  }
}