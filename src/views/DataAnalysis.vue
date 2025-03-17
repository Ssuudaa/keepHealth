<template>
  <div class="app-container">
    <!-- 个人信息、运动计划、膳食计划 ListCard -->
    <div class="cards-container">
      <div class="list-card">
        <h3>个人信息</h3>
        <ul>
          <li><strong>体重：</strong> {{ personalInfo.weight }} kg</li>
          <li><strong>血糖：</strong> {{ personalInfo.bloodSugar }} mmol/L</li>
          <li><strong>尿酸：</strong> {{ personalInfo.uricAcid }} μmol/L</li>
        </ul>
        <el-button @click="editInfo" type="danger" class="btn"
          >修改信息</el-button
        >
      </div>

      <!-- 运动计划 -->
      <div class="list-card">
        <h3>当前运动计划</h3>
        <ul>
          <li>{{ "计划名称:" + sportPlanDetail.EPlanName }}</li>
          <li>{{ "计划描述:" + sportPlanDetail.description }}</li>
        </ul>
        <el-button type="primary" class="btn" @click="fetchSportPlan"
          >查看详情</el-button
        >
      </div>

      <!-- 膳食计划 -->
      <div class="list-card">
        <h3>当前膳食计划</h3>
        <ul>
          <li>{{ "计划名称:" + planDetail.planName }}</li>
          <li>{{ "计划描述:" + planDetail.description }}</li>
        </ul>
        <el-button type="primary" class="btn" @click="fetchDietPlan"
          >查看详情</el-button
        >
      </div>
    </div>

    <!-- 计划详情对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <p><strong>计划名称：</strong> {{ planCommon }}</p>
      <p><strong>计划描述：</strong> {{ descriptionCommon }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>

    <!-- 图表展示 -->
    <div class="charts-container">
      <div class="chart-box">
        <h3>健康指标变化</h3>
        <div ref="lineChart" class="chart"></div>
      </div>
      <div class="chart-box">
        <h3>计划打卡日历</h3>
        <div ref="calendarChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import api from "../api";
export default {
  data() {
    return {
      personalInfo: {
        weight: 0,
        bloodSugar: 0,
        uricAcid: 0,
      },
      dialogVisible: false,
      dialogTitle: "",
      planDetail: [],
      sportPlanDetail: [],
      planCommon:"",
      descriptionCommon:"",
    };
  },
  created() {
    this.fetchPersonalInfo();
    this.fetchAllPlan();
  },
  mounted() {
    this.initLineChart();
    this.initCalendarChart();
  },
  methods: {
    async fetchPersonalInfo() {
      try {
        const response = await api.get("/api/personalInfo");
        if (response.code === 0) {
          this.personalInfo = response.data.data;
        }
      } catch (error) {
        console.error("获取个人信息失败", error);
      }
    },
    async fetchAllPlan() {
      try {
        const response = await api.get("/userCplan/get");
        if (response.code === 200) {
          this.sportPlanDetail = response.data.EPlanVo;
          this.planDetail = response.data.planVo;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchDietPlan() {
      try {
        const response = await api.get("/userCplan/get");
        if (response.code === 200) {
          this.planCommon = response.data.planVo.planName
          this.descriptionCommon = response.data.planVo.description;
        }
      } catch (error) {
        console.error(error);
      }
      this.dialogTitle = "进行中的膳食计划详情";
      this.dialogVisible = true
    },
    async fetchSportPlan() {
      try {
        const response = await api.get("/userCplan/get");
        if (response.code === 200) {
          this.planCommon = response.data.EPlanVo.EPlanName
          this.descriptionCommon = response.data.EPlanVo.description;        }
      } catch (error) {
        console.error(error);
      }
      this.dialogTitle = "进行中的运动计划详情";
      this.dialogVisible = true
    },
    initLineChart() {
      const chart = echarts.init(this.$refs.lineChart);
      const option = {
        xAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五"],
        },
        yAxis: { type: "value" },
        series: [
          {
            type: "line",
            data: [70, 69, 68, 67, 66],
            itemStyle: { color: "#4CAF50" },
          },
        ],
      };
      chart.setOption(option);
    },
    initCalendarChart() {
      const chart = echarts.init(this.$refs.calendarChart);
      const option = {
        visualMap: {
          min: 0,
          max: 10,
          inRange: { color: ["#e0f3f8", "#08519c"] },
        },
        calendar: { range: "2025", cellSize: [30, 30] },
        series: [
          {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: [
              ["2025-03-10", 5],
              ["2025-03-11", 8],
            ],
          },
        ],
      };
      chart.setOption(option);
    },
    editInfo() {
      alert("编辑个人信息功能开发中...");
    },
    gotosportdetail() {
      this.$router.push("/user/exercise");
    },
    gotodietdetail() {
      this.$router.push("/user/meal");
    },
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.list-card {
  position: relative;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 200px;
}

h3 {
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

.btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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
  .cards-container,
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>