<template>
  <div class="config-container">
    <el-row :gutter="20">
      <!-- 膳食分类 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="card-header">
            <h3>膳食分类</h3>
            <el-button
              @click="foodBigDialogVisible = true"
              type="primary"
              class="add-button"
              >新增膳食大类</el-button
            >
          </div>
          <el-table :data="foodList" border>
            <el-table-column prop="name" label="膳食大类" width="180" />
            <el-table-column prop="sName" label="膳食小类">
              <template v-slot="{ row }">
                <span v-if="row.smalltypes.length === 0">暂无小类</span>
                <span v-else>{{
                  row.smalltypes.map((item) => item.SName).join("，")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template v-slot="{ row }">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                  "
                >
                  <el-button
                    type="warning"
                    size="mini"
                    style="margin-left: -1px"
                    @click="openEditDietBigDialog(row)"
                    >编辑大类</el-button
                  >
                  <el-popconfirm
                    title="确定要删除该运动大类吗？"
                    @confirm="deleteExerciseBigType(category.id)"
                  >
                    <template #reference>
                      <el-button
                        type="success"
                        size="mini"
                        style="margin-left: -1px"
                      >
                        删除大类
                      </el-button>
                    </template>
                  </el-popconfirm>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="openDietAddDialog(row)"
                    >添加小类</el-button
                  >

                  <el-button
                    type="danger"
                    size="mini"
                    style="margin-left: -1px"
                    @click="openDeleteDietSubDialog(row)"
                  >
                    删除小类
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 运动分类 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="card-header">
            <h3>运动分类</h3>
            <el-button
              @click="exerciseBigDialogVisible = true"
              type="success"
              class="add-button"
              >新增运动大类</el-button
            >
          </div>
          <el-table :data="exerciseList" border>
            <!-- 运动大类 -->
            <el-table-column prop="name" label="运动大类" width="180" />

            <!-- 运动小类（手动合并） -->
            <el-table-column label="运动小类">
              <template v-slot="{ row }">
                <span v-if="row.ESmalltypes.length === 0">暂无小类</span>
                <span v-else>{{
                  row.ESmalltypes.map((item) => item.esName).join("，")
                }}</span>
              </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作" width="120">
              <template v-slot="{ row }">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                  "
                >
                  <el-button
                    type="warning"
                    size="mini"
                    style="margin-left: -1px"
                    @click="openEditExerciseBigDialog(row)"
                    >编辑大类</el-button
                  >
                  <el-popconfirm
                    title="确定要删除该运动大类吗？"
                    @confirm="deleteExerciseBigType(category.id)"
                  >
                    <template #reference>
                      <el-button
                        type="success"
                        size="mini"
                        style="margin-left: -1px"
                      >
                        删除大类
                      </el-button>
                    </template>
                  </el-popconfirm>

                  <el-button
                    type="primary"
                    size="mini"
                    style="margin-left: -4px"
                    @click="openSportAddDialog(row)"
                    >添加小类</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    style="margin-left: -1px"
                    @click="openDeleteSubDialog(row)"
                  >
                    删除小类
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加膳食大类弹窗 -->
    <el-dialog
      title="新增膳食大类"
      :visible.sync="foodBigDialogVisible"
      width="400px"
    >
      <el-form>
        <el-form-item label="大类名称">
          <el-input v-model="newFoodBigType" placeholder="请输入膳食大类名称" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="foodBigDialogVisible = false">取消</el-button>
        <el-button type="success" @click="addFoodBigType">确认添加</el-button>
      </div>
    </el-dialog>

    <!-- 添加运动大类弹窗 -->
    <el-dialog
      title="新增运动大类"
      :visible.sync="exerciseBigDialogVisible"
      width="400px"
    >
      <el-form>
        <el-form-item label="大类名称">
          <el-input
            v-model="newExerciseBigType"
            placeholder="请输入运动大类名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="exerciseBigDialogVisible = false">取消</el-button>
        <el-button type="success" @click="addExerciseBigType"
          >确认添加</el-button
        >
      </div>
    </el-dialog>

    <!-- 添加膳食小类弹窗 -->
    <el-dialog
      title="添加膳食小类"
      :visible.sync="foodSubDialogVisible"
      width="400px"
    >
      <el-form>
        <!-- 小类名称 -->
        <el-form-item label="小类名称">
          <el-input
            v-model="newFoodSubCategory"
            placeholder="请输入膳食小类名称"
          />
        </el-form-item>

        <!-- 图片上传 -->
        <el-form-item label="小类图片">
          <el-upload
            class="upload-demo"
            :show-file-list="false"
            :http-request="uploadDietFile"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
          <!-- 预览已上传的图片 -->
          <img v-if="dietImage" :src="dietImage" class="preview-dietImage" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="foodSubDialogVisible = false">取消</el-button>
        <el-button type="success" @click="addDietSubCategory"
          >确认添加</el-button
        >
      </div>
    </el-dialog>

    <!-- 添加运动小类弹窗 -->
    <el-dialog
      title="添加运动小类"
      :visible.sync="exerciseSubDialogVisible"
      width="400px"
    >
      <el-form>
        <el-form-item label="小类名称">
          <el-input
            v-model="newExerciseSubCategory"
            placeholder="请输入运动小类名称"
          />
        </el-form-item>
        <el-form-item label="小类图片">
          <el-upload
            class="upload-demo"
            :show-file-list="false"
            :http-request="uploadSportFile"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>

          <!-- 预览已上传的图片 -->
          <img v-if="sportImage" :src="sportImage" class="preview-sportImage" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="exerciseSubDialogVisible = false">取消</el-button>
        <el-button type="success" @click="addExerciseSubCategory"
          >确认添加</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="删除运动小类"
      :visible.sync="deleteSubDialogVisible"
      width="400px"
    >
      <el-table
        :data="
          selectedExerciseCategory && selectedExerciseCategory.ESmalltypes
            ? selectedExerciseCategory.ESmalltypes
            : []
        "
        border
      >
        <el-table-column prop="esName" label="小类名称" />
        <el-table-column label="操作" width="120">
          <template v-slot="{ row }">
            <el-button
              type="danger"
              size="mini"
              @click="deleteExerciseSubCategory(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="deleteSubDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="删除膳食小类"
      :visible.sync="deleteDietSubDialogVisible"
      width="400px"
    >
      <el-table
        :data="
          selectedDietCategory && selectedDietCategory.smalltypes
            ? selectedDietCategory.smalltypes
            : []
        "
        border
      >
        <el-table-column prop="SName" label="小类名称" />
        <el-table-column label="操作" width="120">
          <template v-slot="{ row }">
            <el-button
              type="danger"
              size="mini"
              @click="deleteDietSubCategory(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="deleteDietSubDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑运动大类"
      :visible.sync="editExerciseBigDialogVisible"
      width="400px"
    >
      <el-form>
        <el-form-item label="大类名称">
          <el-input
            v-model="editedExerciseBigType"
            placeholder="请输入新的运动大类名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editExerciseBigDialogVisible = false"
          >取消</el-button
        >
        <el-button type="success" @click="editExerciseBigType"
          >确认修改</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="编辑膳食大类"
      :visible.sync="editDietBigDialogVisible"
      width="400px"
    >
      <el-form>
        <el-form-item label="大类名称">
          <el-input
            v-model="editedDietBigType"
            placeholder="请输入新的膳食大类名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDietBigDialogVisible = false">取消</el-button>
        <el-button type="success" @click="editDietBigType">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      deleteDietSubDialogVisible:false,
      deleteSubDialogVisible: false, // 控制删除对话框
      selectedExerciseCategory: null, // 选中的大类
      selectedDietCategory: null, // 选中的大类
      foodList: [],
      exerciseList: [],
      newFoodSubCategory: "",
      dietImage: "",
      sportImage: "",

      // 大类弹窗
      foodBigDialogVisible: false,
      exerciseBigDialogVisible: false,
      newFoodBigType: "",
      newExerciseBigType: "",

      // 小类弹窗
      foodSubDialogVisible: false,
      exerciseSubDialogVisible: false,
      newFoodSubCategory: "",
      newExerciseSubCategory: "",
      selectedFoodCategory: null,
      ebigId: "",
      editedExerciseBigType: "",
      editExerciseBigDialogVisible: false,
      editedExerciseBigTypeId: "",
      editedDietBigType: "",
      editDietBigDialogVisible: false,
      editedDietBigTypeId: "",
      dietBigId:'',
    };
  },
  mounted() {
    this.fetchFoodList();
    this.fetchExerciseList();
  },
  methods: {
    async fetchFoodList() {
      try {
        const response = await api.get("/bigtype/getAll");
        this.foodList = response.data || [];
      } catch (error) {
        console.error("获取膳食分类失败", error);
      }
    },
    async fetchExerciseList() {
      try {
        const response = await api.get("/eBigtype/getAll");
        this.exerciseList = response.data || [];
      } catch (error) {
        console.error("获取运动分类失败", error);
      }
    },
    openFoodSubDialog(category) {
      this.selectedFoodCategory = category;
      this.newFoodSubCategory = "";
      this.foodSubDialogVisible = true;
    },
    async addFoodBigType() {
      if (!this.newFoodBigType) {
        this.$message.error("请输入膳食大类名称");
        return;
      }
      try {
        await api.put("/bigtype/add", null, {
          params: { bName: this.newFoodBigType },
        });
        this.$message.success("膳食大类添加成功！");
        this.foodBigDialogVisible = false;
        this.fetchFoodList();
      } catch (error) {
        console.error("添加膳食大类失败", error);
      }
    },
    async addExerciseBigType() {
      if (!this.newExerciseBigType) {
        this.$message.error("请输入运动大类名称");
        return;
      }
      try {
        await api.put("/eBigtype/add", null, {
          params: { ebName: this.newExerciseBigType }, // 以 URL 参数方式传递
        });
        this.$message.success("运动大类添加成功！");
        this.exerciseBigDialogVisible = false;
        this.fetchExerciseList();
      } catch (error) {
        console.error("添加运动大类失败", error);
      }
    },
    handleSportImageSuccess(response) {
      this.sportImage = response.data.url; // 假设后端返回 { data: { url: "图片地址" } }
    },
    handleDietImageSuccess(response) {
      this.dietImage = response.data.url; // 假设后端返回 { data: { url: "图片地址" } }
    },

    // 限制上传文件格式和大小
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("只能上传 JPG/PNG 格式的图片!");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 发送添加运动小类请求
    async addExerciseSubCategory() {
      if (!this.newExerciseSubCategory) {
        this.$message.error("请输入小类名称");
        return;
      }
      try {
        const response = await api.post("/admin/addESmallType", {
          esName: this.newExerciseSubCategory,
          image: this.sportImage,
          eBigTypeId: this.ebigId, // 传递图片 URL
        });
        if (response.code === 200) {
          this.$message.success("添加成功！");
          this.exerciseSubDialogVisible = false;
          this.fetchExerciseList(); // 重新获取列表
        }
      } catch (error) {
        console.error("添加失败", error);
        this.$message.error("操作失败，请重试！");
      }
    },
    openSportAddDialog(plan) {
      this.exerciseSubDialogVisible = true;
      this.ebigId = plan.id;
    },
    async addDietSubCategory() {
      if (!this.newFoodSubCategory) {
        this.$message.error("请输入小类名称");
        return;
      }
      try {
        const response = await api.post("/admin/addSmallType", {
          sName: this.newFoodSubCategory,
          image: this.dietImage,
          bigTypeId: this.dietBigId, // 传递图片 URL
        });
        if (response.code === 200) {
          this.$message.success("添加成功！");
          this.foodSubDialogVisible = false;
          this.fetchFoodList(); // 重新获取列表
        }
      } catch (error) {
        console.error("添加失败", error);
        this.$message.error("操作失败，请重试！");
      }
    },
    openDietAddDialog(plan) {
      this.foodSubDialogVisible = true;
      this.dietBigId = plan.id;
    },
    async uploadDietFile(param) {
      const formData = new FormData();
      formData.append("file", param.file);

      try {
        const response = await api.post("/admin/uploadfile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.$message.success("上传成功！");
        this.dietImage = response.msg; // 假设返回的是图片URL
      } catch (error) {
        console.error("上传失败", error);
        this.$message.error("上传失败，请重试！");
      }
    },
    async uploadSportFile(param) {
      const formData = new FormData();
      formData.append("file", param.file);

      try {
        const response = await api.post("/admin/uploadfile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.$message.success("上传成功！");
        this.sportImage = response.msg; // 假设返回的是图片URL
      } catch (error) {
        console.error("上传失败", error);
        this.$message.error("上传失败，请重试！");
      }
    },
    openDeleteSubDialog(category) {
      this.selectedExerciseCategory = category;
      this.deleteSubDialogVisible = true;
    },
    openDeleteDietSubDialog(category) {
      this.selectedDietCategory = category;
      this.deleteDietSubDialogVisible = true;
    },

    // 删除膳食小类
    async deleteDietSubCategory(esId) {
      try {
        await api.delete(`/admin/deleteSmallType/${esId}`);
        this.$message.success("删除成功！");
        this.deleteDietSubDialogVisible = false;
        this.fetchFoodList(); // 重新获取数据，更新页面
      } catch (error) {
        console.error("删除失败", error);
        this.$message.error("删除失败，请重试！");
      }
    },
    //删除运动小类
    async deleteExerciseSubCategory(esId) {
      try {
        await api.delete(`/admin/deleteESmallType/${esId}`);
        this.$message.success("删除成功！");
        this.deleteSubDialogVisible = false;
        this.fetchExerciseList(); // 重新获取数据，更新页面
      } catch (error) {
        console.error("删除失败", error);
        this.$message.error("删除失败，请重试！");
      }
    },
    openEditExerciseBigDialog(category) {
      this.editedExerciseBigTypeId = category.id;
      this.editedExerciseBigType = category.name;
      this.editExerciseBigDialogVisible = true;
    },
    openEditDietBigDialog(category) {
      this.editedDietBigTypeId = category.id;
      this.editedDietBigType = category.name;
      this.editDietBigDialogVisible = true;
    },
    async editExerciseBigType() {
      if (!this.editedExerciseBigType) {
        this.$message.error("请输入运动大类名称");
        return;
      }
      try {
        const formData = new URLSearchParams();
        formData.append("id", this.editedExerciseBigTypeId);
        formData.append("ebName", this.editedExerciseBigType);
        const response = await api.put("/eBigtype/edit", formData);
        if (response.code === 200) {
          this.$message.success("修改成功！");
          this.editExerciseBigDialogVisible = false;
          this.fetchExerciseList();
        }
      } catch (error) {
        console.error("修改失败", error);
        this.$message.error("修改失败，请重试！");
      }
    },
    async editDietBigType() {
      if (!this.editedDietBigType) {
        this.$message.error("请输入膳食大类名称");
        return;
      }
      try {
        const formData = new URLSearchParams();
        formData.append("id", this.editedDietBigTypeId);
        formData.append("bName", this.editedDietBigType);
        const response = await api.put("/bigtype/edit", formData);
        if (response.code === 200) {
          this.$message.success("修改成功！");
          this.editDietBigDialogVisible = false;
          this.fetchFoodList();
        }
      } catch (error) {
        console.error("修改失败", error);
        this.$message.error("修改失败，请重试！");
      }
    },
    async deleteExerciseBigType(id) {
      try {
        await api.delete(`/eBigtype/delete/${id}`);
        this.$message.success("删除成功！");
        this.fetchExerciseList(); // 重新获取数据，更新页面
      } catch (error) {
        console.error("删除失败", error);
        this.$message.error("删除失败，请重试！");
      }
    },
  },
};
</script>


<style scoped>
.config-container {
  padding: 20px;
  overflow-y: auto;
}
h3 {
  text-align: center;
  margin-bottom: 15px;
}
.add-button {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>