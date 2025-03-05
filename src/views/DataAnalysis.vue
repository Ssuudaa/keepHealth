<template>
  <div class="app-container">
    <!-- 个人信息卡片 -->
    <div class="info-card">
      <h2>个人信息</h2>
      <div v-if="personalInfo.name" class="info-details">
        <div class="info-item">
          <strong>姓名：</strong> {{ personalInfo.name }}
        </div>
        <div class="info-item">
          <strong>身高：</strong> {{ personalInfo.height }} cm
        </div>
        <div class="info-item">
          <strong>体重：</strong> {{ personalInfo.weight }} kg
        </div>
        <div class="info-item">
          <strong>年龄：</strong> {{ personalInfo.age }} 岁
        </div>
        <div class="info-item">
          <strong>性别：</strong> {{ personalInfo.gender }}
        </div>
        <div class="btn-container">
          <button @click="editInfo" class="btn">修改个人信息</button>
        </div>
      </div>
      <!-- 如果没有个人信息，显示提示和添加按钮 -->
      <div v-else>
        <p style="  text-align: center;">当前暂无个人信息，请添加</p>
        <div class="btn-container">
          <button @click="addInfo" class="btn">添加个人信息</button>
        </div>
      </div>
    </div>

    <!-- 弹窗：添加个人信息 -->
    <el-dialog title="添加个人信息" :visible.sync="isDialogVisible" @close="resetInfo">
      <el-form :model="personalInfo" ref="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="personalInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="身高">
          <el-input-number v-model="personalInfo.height" :min="0" label="身高" style="width: 100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="体重">
          <el-input-number v-model="personalInfo.weight" :min="0" label="体重" style="width: 100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="personalInfo.age" :min="0" label="年龄" style="width: 100%;"></el-input-number>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="personalInfo.gender" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveInfo">保存</el-button>
      </div>
    </el-dialog>

    <div class="charts-container">
        <div class="chart-box">
          <h3>健康指标统计</h3>
          <div ref="barChart" class="chart"></div>
        </div>
        <div class="chart-box">
          <h3>健康数据 3D 圆柱图</h3>
          <div ref="cylinderChart" class="chart"></div>
        </div>
        <div class="chart-box">
          <h3>BMI 比例分布</h3>
          <div ref="bmiChart" class="chart"></div>
        </div>
        <div class="chart-box">
          <h3>理想体重范围</h3>
          <div ref="idealWeightChart" class="chart"></div>
        </div>
      </div>
  </div>
</template>


<script>
import * as echarts from "echarts";
import "echarts-gl";
export default {
  data() {
    return {
      // 存储个人信息
      personalInfo: {
        name: '小明',
        height: 170,
        weight: 70,
        age: 24,
        gender: '女'
      },
      isDialogVisible: false, // 弹窗显示控制
    };
  },
  mounted() {
    this.initBarChart();
    this.initCylinderChart();
    this.initBmiChart();
    this.initIdealWeightChart();
  },
  methods: {
    initBarChart() {
      const chart = echarts.init(this.$refs.barChart);
      const option = {
        xAxis: { type: "category", data: ["体重", "身高", "BMI", "脂肪率"] },
        yAxis: { type: "value" },
        series: [{ type: "bar", data: [70, 175, 22.9, 18], itemStyle: { color: "#4CAF50" } }],
      };
      chart.setOption(option);
    },

    initCylinderChart() {
      const chart = echarts.init(this.$refs.cylinderChart);
      const option = {
        xAxis3D: { type: "category", data: ["蛋白质", "脂肪", "碳水"], name: "" },
        yAxis3D: { type: "category", name: "" },
        zAxis3D: { type: "value", name: "" },
        grid3D: { boxWidth: 100, boxDepth: 40 },
        series: [{ type: "bar3D", data: [[0, 0, 80], [1, 0, 40], [2, 0, 90]], shading: "lambert" }],
      };
      chart.setOption(option);
    },

    initBmiChart() {
      const chart = echarts.init(this.$refs.bmiChart);
      const option = {
        series: [{
          type: "pie",
          radius: ["40%", "70%"],
          data: [
            { value: 40, name: "正常", itemStyle: { color: "#4CAF50" } },
            { value: 30, name: "超重", itemStyle: { color: "#FFC107" } },
            { value: 20, name: "肥胖", itemStyle: { color: "#F44336" } },
            { value: 10, name: "偏瘦", itemStyle: { color: "#2196F3" } },
          ],
        }],
      };
      chart.setOption(option);
    },

    initIdealWeightChart() {
      const chart = echarts.init(this.$refs.idealWeightChart);
      const currentWeight = 70;
      const idealMin = 60;
      const idealMax = 75;
      const outOfRange = currentWeight < idealMin || currentWeight > idealMax;

      const option = {
        series: [{
          type: "pie",
          radius: ["40%", "70%"],
          data: [
            { value: Math.max(0, currentWeight - idealMin), name: "理想范围", itemStyle: { color: "#4CAF50" } },
            { value: outOfRange ? Math.abs(currentWeight - idealMax) : 0, name: "超出范围", itemStyle: { color: "#F44336" } },
          ],
        }],
      };
      chart.setOption(option);
    },

    // 添加个人信息
    addInfo() {
      this.isDialogVisible = true;
    },

    // 修改个人信息
    editInfo() {
      this.isDialogVisible = true;
    },

    // 保存个人信息
    saveInfo() {
      // 保存逻辑
      this.isDialogVisible = false;
    },

    // 重置个人信息
    resetInfo() {
      this.personalInfo = {
        name: '',
        height: null,
        weight: null,
        age: null,
        gender: ''
      };
    }
  },
};
</script>


<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto; 
  /* 添加这行，确保容器内容超出时会滚动 */
}

.info-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.info-card h2 {
  margin-bottom: 15px;
  text-align: center;
  font-size: 24px;
  color: #333;
}

.info-details {
  grid-template-columns: 1fr 1fr;
  display: grid;
  gap: 10px;
  text-align: left;
  width: 100%;
}

.info-item {
  font-size: 16px;
  color: #555;
}

.btn {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 200px;
}

.btn-container {
  grid-column: span 2; /* 使按钮跨越两列 */
  display: flex;
  justify-content: center; /* 水平居中 */
  margin-top: 20px;
}

.btn:hover {
  background-color: #45a049;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
}

.chart-box {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.chart {
  width: 100%;
  height: 220px;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>
