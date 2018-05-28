<template>
  <div class="app-container">
    <el-table v-if="isAllDatabases" :data="dbData" emptyText="暫無數據">
      <el-table-column
        min-width="50"
        max-width="120"
        align="center"
        v-for="{ prop, label } in dbColumns"
        :key="prop"
        :prop="prop"
        :label="label">
      </el-table-column>
      <el-table-column
        align="center"
        label="進入資料庫">
        <template slot-scope="scope">
          <el-button class="ailabs-btn-green" size="mini" type="success" v-on:click="handleList(scope.row)">{{$t('進入資料庫')}}</el-button>
          <el-button class="ailabs-btn-blue" size="mini" type="success" v-on:click="edit_db()">{{$t('編輯資料庫')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-if="!isAllDatabases" :data="fileData">
      <el-table-column
        min-width="50"
        max-width="120"
        align="center"
        v-for="{ prop, label } in fileColumns"
        :key="prop"
        :prop="prop"
        :label="label">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  data() {
    this.dbColumns = [
      { prop: 'id', label: '編號' },
      { prop: 'name', label: '數據庫名稱' },
      { prop: 'classify', label: '衛星基地計畫類別' },
      { prop: 'group', label: '數據提供單位' },
      { prop: 'data_classify', label: '數據領域類別' },
      // { prop: 'data_comment', label: '內容說明' },
      { prop: 'index_keyword', label: '索引關鍵字' },
      { prop: 'data_type', label: '數據檔案類型' },
      // { prop: 'path', label: '數據目錄' },
      // { prop: 'api_path', label: '數據應用 API 放置目錄' },
      // { prop: 'apidoc_path', label: '數據應用 API 使用說明檔放置目錄' },
      { prop: 'website', label: '示範應用網站入口' },
      { prop: 'date', label: '數據庫建立日期' },
    ]
    this.fileColumns = [
      { prop: 'id', label: '編號' },
      { prop: 'name', label: '檔案名稱' },
      { prop: 'db_id', label: '資料庫編號' },
      { prop: 'comment', label: '註解' },
      { prop: 'date', label: '日期' },
      { prop: 'extname', label: '副檔名稱' },
      { prop: 'path', label: '檔案路徑' },
      { prop: 'size', label: '檔案大小' },
    ]
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      },
      dbData: [],
      fileData: [],
      isAllDatabases: true
    }
  },
  watch: {
    fileData(val) {
      console.log(val)
    }
  },
  mounted() {
    if(this.$route.query.id) {
      console.log(this.$route.query.id)
      this.$http.get(`/database/${this.$route.query.id}`)
      .then(res => {
        console.log(res.data)
        this.isAllDatabases = false
        this.fileData = res.data
      }).catch(err => {
        console.log(err.response)
      })
    } else {
      this.$http.get('/databases')
      .then(res => {
        this.dbData = res.data
      }).catch(err => {
        console.log(err.response)
      })
    }
  },
  methods: {
    handleList(row) {
      this.$router.push({ name: 'list', query: { id: row.id }})
      this.$http.get(`/database/${this.$route.query.id}`)
      .then(res => {
        console.log(res.data)
        this.isAllDatabases = false
        this.fileData = res.data
      }).catch(err => {
        console.log(err.response)
      })
    },
    generateDate({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.$emit('on-selected-file', this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      this.handleUpload(e.dataTransfer.files[0])
    },
    handleFileChange(e) {
      const files = e.target.files
      const itemFile = files[0] // only use files[0]
      this.handleUpload(itemFile)
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    triggerUpload() {
      document.getElementById('excel-upload-input').click()
    },
    handleUpload(file) {
      var data = new FormData();
      data.append('file', file) // only use files[0]
      data.append('comment', '')
      console.log(file)
      this.$http.post('/upload', data)
      .then(res => {
        console.log(res.data)
      }).catch(err => {
        if(err.response.status === 403) {
          this.logout()
        }
        console.error(err.response)
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    readerData(itemFile) {
      const reader = new FileReader()
      reader.onload = e => {
        const data = e.target.result
        const fixedData = this.fixdata(data)
        const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const header = this.get_header_row(worksheet)
        const results = XLSX.utils.sheet_to_json(worksheet)
        this.generateDate({ header, results })
      }
      reader.readAsArrayBuffer(itemFile)
    },
    fixdata(data) {
      let o = ''
      let l = 0
      const w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    get_header_row(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
        var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    }
  }
}
</script>

<style scoped>
#excel-upload-input{
  display: none;
  z-index: -9999;
}
#drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
