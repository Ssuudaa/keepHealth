<template>
  <div class="app-container">
    <!-- 个人信息、运动计划、膳食计划 ListCard -->
    <div class="cards-container">
      <div class="list-card">
        <h3>个人信息</h3>
        <ul>
          <li><strong>姓名：</strong> {{ personalInfo.name }}</li>
          <li><strong>身高：</strong> {{ personalInfo.height }} cm</li>
          <li><strong>体重：</strong> {{ personalInfo.weight }} kg</li>
          <li><strong>年龄：</strong> {{ personalInfo.age }} 岁</li>
          <li><strong>性别：</strong> {{ personalInfo.gender }}</li>
        </ul>
        <el-button @click="editInfo" type="danger" class="btn">修改信息</el-button>
      </div>

      <div class="list-card">
        <h3>运动计划</h3>
        <ul>
          <li>每天跑步 30 分钟</li>
          <li>每周健身 3 次</li>
          <li>瑜伽放松</li>
        </ul>
        <el-button type="primary" class="btn">查看详情</el-button>
      </div>

      <div class="list-card">
        <h3>膳食计划</h3>
        <ul>
          <li>早餐：燕麦 + 牛奶</li>
          <li>午餐：鸡胸肉 + 蔬菜</li>
          <li>晚餐：低碳水饮食</li>
        </ul>
        <el-button type="primary" class="btn">查看详情</el-button>
      </div>
    </div>

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
export default {
  data() {
    return {
      personalInfo: {
        name: "小明",
        height: 170,
        weight: 70,
        age: 24,
        gender: "男",
      },
    };
  },
  mounted() {
    this.initLineChart();
    this.initCalendarChart();
    this.initBmiChart();
    this.initIdealWeightChart();
  },
  methods: {
    initLineChart() {
      const chart = echarts.init(this.$refs.lineChart);
      const option = {
        xAxis: { type: "category", data: ["周一", "周二", "周三", "周四", "周五"] },
        yAxis: { type: "value" },
        series: [{ type: "line", data: [70, 69, 68, 67, 66], itemStyle: { color: "#4CAF50" } }],
      };
      chart.setOption(option);
    },

    initCalendarChart() {
      const chart = echarts.init(this.$refs.calendarChart);
      const option = {
        visualMap: { min: 0, max: 10, inRange: { color: ["#e0f3f8", "#08519c"] } },
        calendar: { range: "2025", cellSize: [30, 30] },
        series: [{ type: "heatmap", coordinateSystem: "calendar", data: [["2025-03-10", 5], ["2025-03-11", 8]] }],
      };
      chart.setOption(option);
    },

    initBmiChart() {
      const chart = echarts.init(this.$refs.bmiChart);
      const option = {
        tooltip: { trigger: "item" },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: [
              { value: 10, name: "偏瘦" },
              { value: 40, name: "正常" },
              { value: 30, name: "超重" },
              { value: 20, name: "肥胖" },
            ],
          },
        ],
      };
      chart.setOption(option);
    },

    initIdealWeightChart() {
      const chart = echarts.init(this.$refs.idealWeightChart);
      const option = {
        xAxis: { type: "category", data: ["最低", "当前", "最高"] },
        yAxis: { type: "value" },
        series: [{ type: "bar", data: [60, 70, 75], itemStyle: { color: "#FF9800" } }],
      };
      chart.setOption(option);
    },

    editInfo() {
      alert("编辑个人信息功能开发中...");
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
  height:250px;
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
  bottom: 20px; /* 距离底部 20px */
  left: 50%;
  transform: translateX(-50%); /* 水平居中 */
  width: calc(100% - 40px); /* 让按钮宽度与父元素匹配，适当留边距 */
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
