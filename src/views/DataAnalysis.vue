<template>
    <div class="charts-container">
      <!-- 柱状图 -->
      <div class="chart-box">
        <h3>健康指标统计</h3>
        <div ref="barChart" class="chart"></div>
      </div>
  
      <!-- 3D 圆柱图 -->
      <div class="chart-box">
        <h3>健康数据 3D 圆柱图</h3>
        <div ref="cylinderChart" class="chart"></div>
      </div>
  
      <!-- BMI 比例环形图 -->
      <div class="chart-box">
        <h3>BMI 比例分布</h3>
        <div ref="bmiChart" class="chart"></div>
      </div>
  
      <!-- 理想体重范围环形图 -->
      <div class="chart-box">
        <h3>理想体重范围</h3>
        <div ref="idealWeightChart" class="chart"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from "echarts";
  import "echarts-gl";
  
  export default {
    mounted() {
      this.initBarChart();
      this.initCylinderChart();
      this.initBmiChart();
      this.initIdealWeightChart();
      setTimeout(() => {
    console.log("el-dialog:", document.querySelector(".el-dialog"));
  }, 2000);
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
          xAxis3D: { type: "category", data: ["蛋白质", "脂肪", "碳水"],name:"" },
          yAxis3D: { type: "category",name:"" },
          zAxis3D: { type: "value",name:"" },
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
    },
  };
  </script>
  
  <style scoped>
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