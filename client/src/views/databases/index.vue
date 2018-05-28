<template>
  <div class="app-container calendar-list-container">
    <!-- <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.title">
      </el-input>
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" :placeholder="$t('table.type')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      -->
      
      <!--
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox>
    </div> -->

    <p>
    <el-button icon="el-icon-check" type="warning" :loading="generateLoading" @click="generate()">{{ $t('table.generate') }}</el-button>
    <el-button style="margin-left: 10px;" @click="handleCreate()" type="success" icon="el-icon-plus">{{$t('table.add')}}</el-button>
    </p>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="給我一點時間" border fit highlight-current-row
      style="width: 100%">

      <el-table-column
        align="center"
        v-for="{ prop, label } in dbColumns"
        :key="prop"
        :prop="prop"
        :label="label">
      </el-table-column>
      <el-table-column align="center" width="230" :label="$t('table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button type="danger" size="small" icon="el-icon-close" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
          <!-- <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{$t('table.publish')}}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{$t('table.draft')}}
          </el-button> -->
          
        </template>
      </el-table-column>
    </el-table>

    

    <!-- <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="220x" style='width: 300px; margin-left:50px;'>

        <el-form-item label="編號">
          <el-input v-model="temp.id"></el-input>
        </el-form-item>

        <el-form-item label="數據庫名稱" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>

        <el-form-item label="密碼">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>

        <el-form-item label="衛星基地計畫類別" prop="classify">
          <el-select class="filter-item" v-model="temp.classify" placeholder="Please select">
            <el-option v-for="item in  classify" :key="item" :label="item.display_name" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="數據提供單位" prop="group">
          <el-select class="filter-item" v-model="temp.group" placeholder="Please select">
            <el-option v-for="item in  group" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="數據領域類別" prop="data_classify">
          <el-select class="filter-item" v-model="temp.data_classify" placeholder="Please select">
            <el-option v-for="item in  data_classify" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          </el-form-item>

        <el-form-item label="內容說明">
          <el-input type="textarea" v-model="temp.data_comment"></el-input>
        </el-form-item>

        <el-form-item label="數據檔案類型" prop="data_type">
          <el-checkbox-group class="filter-item" v-model="temp.data_type"> 
            <el-checkbox v-for="key in data_type" :key="key" :label="key"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="示範應用網站入口" prop="website">
          <el-input v-model="temp.website"></el-input>
        </el-form-item>
        
        <el-form-item label="數據目錄">
          <el-input v-model="temp.path"></el-input>
        </el-form-item>

        <el-form-item label="數據應用 API 放置目錄">
          <el-input v-model="temp.api_path"></el-input>
        </el-form-item>

        <el-form-item label="數據應用 API 使用說明檔放置目錄">
          <el-input v-model="temp.apidoc_path"></el-input>
        </el-form-item>

        

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv } from "@/api/article";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];

const group = [
  "Taiwan AI Labs",
  "成功大學",
  "高雄大學",
  "交通大學",
  "高雄科技大學(第一校區)",
  "高雄科技大學(建工/燕巢校區)",
  "大仁科技大學",
  "中正大學",
  "義守大學",
  "凌耀電子"
];
const data_classify = [
  "無人載具",
  "智慧機械/智慧製造",
  "智慧農業",
  "智慧醫療",
  "物聯網/AR/VR",
  "智慧演算/FINTECH"
];
const data_type = [
  ".jpg",
  ".csv",
  ".json",
  ".wav",
  ".trs",
  ".txt",
  ".avi",
  ".stl",
  ".bmp",
  ".pdf",
  ".xlsx",
  ".rdb",
  ".mdf",
  ".mp4",
  ".m4a",
  "others"
];

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "complexTable",
  directives: {
    waves
  },
  data() {
    this.dbColumns = [
      { prop: "id", label: "編號" },
      { prop: "name", label: "數據庫名稱" },
      // { prop: "password", label: "密碼"},
      { prop: "classify", label: "衛星基地計畫類別" },
      { prop: "group", label: "數據提供單位" },
      { prop: "data_classify", label: "數據領域類別" },
      // { prop: 'data_comment', label: '內容說明' },
      { prop: "data_type", label: "數據檔案類型" },
      // { prop: 'path', label: '數據目錄' },
      // { prop: 'api_path', label: '數據應用 API 放置目錄' },
      // { prop: 'apidoc_path', label: '數據應用 API 使用說明檔放置目錄' },
      { prop: "website", label: "示範應用網站入口" },
      { prop: "date", label: "數據庫建立日期" }
    ];
    return {
      generateLoading: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      classify: ["標竿型", "特色型", "個別型"],
      group,
      data_classify,
      data_type: data_type,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [
          {
            required: true,
            message: "name is required",
            trigger: "change"
          }
        ]
      },
      downloadLoading: false
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    formatList() {
      for (var i = 0; i < this.list.length; i++) {
        this.list[i].data_type = this.list[i].data_type
          .replace(/\s/g, "")
          .split(",");
        // console.log(this.list[i].data_type)
      }
    },
    getList() {
      this.listLoading = true;
      this.$http
        .get("/databases")
        .then(res => {
          this.list = res.data;
          this.formatList();
          this.total = res.data.total;
        })
        .catch(err => {
          console.error(err.response);
          console.error(err);
        });
      this.listLoading = false;
    },
    generate() {
      this.generateLoading = true;
      this.$http
        .get("/generate")
        .then(res => {
          console.log(res.data);
          this.generateLoading = false;
          alert("轉換成功!");
        })
        .catch(err => {
          alert("轉換失敗" + err);
        });
    },
    // handleFilter() {
    //   this.listQuery.page = 1;
    //   this.getList();
    // },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    resetTemp() {
      this.temp = {
        id: "",
        name: "",
        password: "",
        data_classify: undefined,
        group: undefined,
        data_type: [],
        classify: undefined,
        data_comment: "",
        website: "",
        api_path: "",
        path: "",
        apidoc_path: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // this.temp.author = "vue-element-admin";
          this.temp.data_type = this.temp.data_type.join(", ");
          console.log(this.temp);
          this.$http
            .post("/databases", { db_info: this.temp })
            .then(res => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            })
            .catch(err => {
              alert("新增失敗");
              console.error(err.response);
              console.error(err);
            });
          this.getList();
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.data_type = tempData.data_type.join(", ");
          this.$http
            .put("/databases", { db_info: tempData, id: tempData.id })
            .catch(err => {
              console.error(err.response);
              console.error(err);
            });
          this.dialogFormVisible = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
          this.getList();
          // console.log(tempData);
        }
      });
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row);
      this.$confirm("此操作將永久刪除該文件, 是否繼續？", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.$http.delete("/databases", { 
          params: {
            id: this.temp.id
          },
          data: {
            id: this.temp.id
          }
        }).then(res => {
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
          this.getList();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          })
        }).catch(err => {
          console.error(err)
          this.$notify({
              title: "錯誤",
              message: "刪除失敗",
              type: "error",
              duration: 2000
            });
        })
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
