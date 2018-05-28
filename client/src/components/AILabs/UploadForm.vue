<template>
  <div class="app-container calendar-list-container">
    <!-- <input id="excel-upload-input" ref="excel-upload-input" type="file" accept="*" class="c-hide" @change="handleFileChange"> -->
    <input id="excel-upload-input" ref="excel-upload-input" type="file" accept="*" class="c-hide" @change="handleFileChange">
    <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop file here or
      <el-button style="margin-left:16px;" size="mini" type="primary" @click="triggerUpload">browse</el-button>
    </div>

    <el-table :data="fileData" empty-text="尚未上傳檔案">
      <el-table-column
        v-for="{ prop, label } in columns"
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
    this.columns = [
      { prop: 'name', label: '檔案名稱' },
      { prop: 'size', label: '檔案大小' },
      { prop: 'type', label: '檔案類型' },
      { prop: 'status', label: '狀態' }
    ]
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      },
      fileData: []
    }
  },
  watch: {
    fileData: function(val) {
      console.log(val)
    }
  },
  mounted() {
  },
  methods: {
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
      const rowId = this.fileData.length
      data.append('file', file) // only use files[0]
      data.append('comment', '')
      file.status = '上傳中'
      this.fileData.push(file)
      this.$http.post('/upload', data)
      .then(res => {
        var old = this.fileData[rowId]
        old.status = '上傳成功';
        this.$set(this.fileData, rowId, old)
      }).catch(err => {
        var old = this.fileData[rowId]
        old.status = '上傳失敗';
        this.$set(this.fileData, rowId, old)
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
