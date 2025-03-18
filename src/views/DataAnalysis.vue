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
        <el-button type="primary" class="btn" @click="getEPlanDetail(sportPlanDetail)"
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
        <el-button type="primary" class="btn" @click="getPlanDetail(planDetail)"
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

    <el-dialog :visible.sync="detailDialogVisible" title="计划详情" width="50%">
      <div class="plan-detail-list">
        <el-card v-for="(item, index) in planDetails" :key="index" class="detail-card">
          <img :src="item.image" class="plan-image" />
          <div class="detail-title">{{ item.name }}</div>
        </el-card>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="infoDialogVisible" title="修改个人信息" width="40%">
      <el-form label-width="80px">
        <el-form-item label="体重">
          <el-input v-model="personalInfo.weight" type="number" suffix="kg" />
        </el-form-item>
        <el-form-item label="血糖">
          <el-input v-model="personalInfo.bloodSugar" type="number" suffix="mmol/L" />
        </el-form-item>
        <el-form-item label="尿酸">
          <el-input v-model="personalInfo.uricAcid" type="number" suffix="μmol/L" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="infoDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updatePersonalInfo">保存</el-button>
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
  <el-calendar v-model="calendarDate">
    <template slot="dateCell" slot-scope="{ date, data }">
      <div :class="{'marked-day': isMarked(date)}">
        {{ data.day }}
      </div>
    </template>
  </el-calendar>
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
      infoDialogVisible:false,
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
      detailDialogVisible:false,
      calendarDate: new Date(),
    markedDates: ["2025-03-10", "2025-03-11"], // 这里存储打卡的日期
    };
  },
  created() {
    this.fetchPersonalInfo();
    this.fetchAllPlan();
    this.getPersonalInfo()
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
    async getPersonalInfo() {
      try {
        const response = await api.get("/personalDetail/get");
        this.personalInfo = response.data || {};
      } catch (error) {
        console.error("获取个人信息失败", error);
      }
    },
    editInfo() {
      this.infoDialogVisible = true;
    },
    async updatePersonalInfo() {
      try {
        await api.put("/personalDetail/add", this.personalInfo);
        this.$message.success("个人信息更新成功！");
        this.infoDialogVisible = false;
        this.getPersonalInfo();
      } catch (error) {
        console.error("更新个人信息失败", error);
        this.$message.error("更新失败，请重试！");
      }
    },
    initLineChart() {
  const chart = echarts.init(this.$refs.lineChart);
  const option = {
    grid: {
      left: "10%",   // 左侧间距
      right: "10%",  // 右侧间距
      top: "10%",    // 顶部间距
      bottom: "10%", // 底部间距，减少空白
      containLabel: true
    },
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
        lineStyle: { width: 3 }, // 让线更粗
        symbolSize: 8, // 让点更大
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
    gotosportdetail() {
      this.$router.push("/user/exercise");
    },
    gotodietdetail() {
      this.$router.push("/user/meal");
    },
    async getPlanDetail(plan) {
      try {
        const response = await api.get(`/plan/getDetail`, { params: { id: plan.id } });
        this.planDetails = response.data.smalltypes.map(item => ({ name: item.name, image: item.image }));
        this.detailDialogVisible = true;
      } catch (error) {
        console.error("获取计划详情失败", error);
        this.$message.error("获取计划详情失败，请重试！");
      }
    },
    async getEPlanDetail(plan) {
      try {
        const response = await api.get(`/ePlan/getDetail`, { params: { id: plan.id } });
        this.planDetails = response.data.smalltypes.map(item => ({ name: item.name, image: item.image }));
        this.detailDialogVisible = true;
      } catch (error) {
        console.error("获取计划详情失败", error);
        this.$message.error("获取计划详情失败，请重试！");
      }
    },
    isMarked(date) {
    const formattedDate = this.formatDate(date);
    return this.markedDates.includes(formattedDate);
  },
  formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
  height: 620px;
}

@media (max-width: 768px) {
  .cards-container,
  .charts-container {
    grid-template-columns: 1fr;
  }
}
.plan-detail-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px; /* 控制卡片间距 */
  justify-content: center;
  padding: 10px;
  max-height: 500px; /* 避免超出 */
  overflow-y: auto; /* 允许滚动 */
}

.detail-card {
  width: 100%;
  text-align: center;
  padding: 10px;
  margin: 5px; /* 额外增加间距 */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.plan-image {
  width: 100px; /* 固定宽度 */
  height: 100px; /* 固定高度 */
  object-fit: cover; /* 防止图片变形 */
  border-radius: 5px;
}


.detail-title {
  margin-top: 10px;
  font-weight: bold;
}
.marked-day {
  background-color: #f56c6c;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  display: inline-block;
}
</style>