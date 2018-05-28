module.exports = {
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "minLength": 1
    },
    "name": {
      "type": "string",
      "minLength": 1
    },
    "classify": {
      "type": "string",
      "enum": [ "標竿型", "特色型", "個別型" ] 
    },
    "group": {
      "type": "string",
      // "enum": [ "Taiwan AI Labs", "成功大學", "高雄大學", "交通大學", 
      //             "高雄科技大學(第一校區)", "高雄科技大學(建工/燕巢校區)",
      //             "大仁科技大學", "中正大學", "義守大學", "凌耀電子" ]
    },
    "data_classify": {
      "type": "string",
      // "enum": [ "無人載具", "智慧機械/智慧製造", "智慧農業", "智慧城市",
      //             "智慧醫療", "物聯網/AR/VR", "智慧演算/FINTECH" ]
    },
    "data_comment": { "type": "string" },
    "data_type": {
      "type": "string",
      // "enum": [ ".jpg", ".csv", ".json", ".wav", ".trs", ".txt", 
      //                 ".avi", ".stl", ".bmp", ".pdf", ".xlsx", ".rdb",
      //                 ".mdf", ".mp4", ".m4a", "others" ]
    },
    "website": { "type": "string" }
  },
  "required": [ "id", "name", "classify", "group", "data_classify", 
                "data_comment", "data_type", "website" ]
}