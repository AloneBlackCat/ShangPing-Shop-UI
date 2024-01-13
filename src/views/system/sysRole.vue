<template>
  <div class="search-div">
    <!-- 搜索表单 -->
    <el-form label-width="70px" size="small">
      <el-form-item label="角色名称">
        <el-input
          v-model="queryDto.roleName"
          style="width: 100%"
          placeholder="角色名称"
        ></el-input>
      </el-form-item>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchSysRole">
          搜索
        </el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </el-row>
    </el-form>

    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <!--- 角色表格数据 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="roleCode" label="角色code" width="180" />
      <el-table-column prop="description" label="角色描述" width="180" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="updateRole(scope.row)">
          修改
        </el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
          删除
        </el-button>
      </el-table-column>
    </el-table>

    <!--分页条-->
    <el-pagination
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="[5, 10, 15, 30]"
      @size-change="fetchData"
      @current-change="fetchData"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />
  </div>
  <!-- 添加角色表单对话框 -->
  <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
    <el-form label-width="120px">
      <el-form-item label="角色名称">
        <el-input v-model="sysRole.roleName" />
      </el-form-item>
      <el-form-item label="角色Code">
        <el-input v-model="sysRole.roleCode" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="sysRole.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  DeleteSysRole,
  GetSysRoleListByPage,
  SaveSysRole,
  UpdateSysRole,
} from '@/api/sysRole'
import { ElMessage, ElMessageBox } from 'element-plus'
// 定义数据模型

const dialogVisible = ref(false)

const roleForm = {
  id: '',
  roleName: '',
  roleCode: '',
  description: '',
}

const sysRole = ref(roleForm)

const deleteById = id => {
  ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const { code } = await DeleteSysRole(id)
    if (code === 200) {
      ElMessage.success('删除成功')
      pageParams.value.page = 1
      await fetchData()
    }
  })
}

// 修改
const updateRole = row => {
  // 对象拓展运算符
  sysRole.value = { ...row }
  dialogVisible.value = true
}

// 点击添加弹层
const addShow = () => {
  sysRole.value = {}
  dialogVisible.value = true
}
// 添加和修改
const submit = async () => {
  if (!sysRole.value.id) {
    const { code } = await SaveSysRole(sysRole.value)
    if (code === 200) {
      // 关闭弹框
      dialogVisible.value = false
      // 提示数据
      ElMessage.success('添加成功')
      // 刷新页面
      await fetchData()
    }
  } else {
    const { code } = await UpdateSysRole(sysRole.value)
    if (code === 200) {
      // 关闭弹框
      dialogVisible.value = false
      // 提示数据
      ElMessage.success('修改成功')
      // 刷新页面
      await fetchData()
    }
  }
}

// 角色列表
let list = ref([])
// 总记录数
let total = ref(0)

const pageParamsForm = {
  page: 1, // 当前页
  limit: 5, // 每页记录数
}

const pageParams = ref(pageParamsForm)

const queryDto = ref({ roleName: '' }) // 条件封装数据

// 钩子函数
onMounted(() => {
  fetchData()
})
// 列表方法
const fetchData = async () => {
  const { data } = await GetSysRoleListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )
  list.value = data.list
  total.value = data.total
}
// 搜索方法
const searchSysRole = () => {
  fetchData()
}

const resetData = () => {
  queryDto.value.roleName = ''
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
