<template>
    <div class="chatbox-container">
      <!-- 在聊天框外面添加标题 -->
      <div class="assistant-title">
        这里是智能助手，有什么可以帮助您
      </div>
      
      <div class="chatbox">
        <div class="messages">
          <div
            class="message"
            v-for="(msg, index) in messages"
            :key="index"
            :class="{
              'user-message': msg.from === 'user',
              'assistant-message': msg.from === 'assistant'
            }"
          >
            <span>{{ msg.text }}</span>
          </div>
        </div>
  
        <el-input
          v-model="userInput"
          placeholder="请输入您的问题（如：如何减肥？）"
          @keyup.enter="sendMessage"
          clearable
          class="input-box"
        ></el-input>
        <el-button type="primary" @click="sendMessage" class="send-btn">发送</el-button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userInput: "", // 用户输入
        messages: [], // 消息数组
        userStats: {
          weight: 70, // 体重
          height: 175, // 身高
          bmi: 22.9, // BMI
          activityLevel: "低", // 运动水平
        },
      };
    },
    methods: {
      sendMessage() {
        if (this.userInput.trim()) {
          // 添加用户消息
          this.messages.push({ from: "user", text: this.userInput });

          const userMessage = this.userInput;
          this.userInput = "";
  
          // 模拟助手回应
          setTimeout(() => {
            const assistantResponse = this.getAssistantResponse(userMessage);
            this.messages.push({ from: "assistant", text: assistantResponse });
          }, 1000);
        }
      },
      getAssistantResponse(userQuestion) {
        const normalizedInput = userQuestion
          .trim()
          .toLowerCase()
          .replace(/[？!。，]/g, "");
        const responses = {
          你好: "你好！我可以帮助你进行健康和运动相关的咨询。",
          如何减肥: this.getWeightLossAdvice(),
          如何增加肌肉: this.getMuscleGainAdvice(),
          怎样提高运动能力: this.getFitnessAdvice(),
          我的bmi是多少: `你的BMI是: ${this.userStats.bmi}。根据标准，BMI值在 18.5 - 24.9 之间是正常范围。`,
          我该做什么运动: this.suggestExercise(),
          什么是健康饮食:
            "健康饮食包括均衡的营养摄入，适量的蛋白质、碳水化合物和脂肪，避免过多的糖分和加工食品。",
          默认: "抱歉，我没有理解你的问题。试试其他问题吧。",
        };
  
        return responses[normalizedInput] || responses["默认"];
      },
  
      getWeightLossAdvice() {
        if (this.userStats.bmi > 24.9) {
          return "要减肥，你可以增加有氧运动（如跑步、游泳等），并减少高脂肪和高糖的食物摄入。保持健康的饮食，避免暴饮暴食。";
        } else {
          return "你已经处于健康的体重范围，保持均衡饮食和规律运动即可。";
        }
      },
  
      getMuscleGainAdvice() {
        return "增加肌肉需要进行力量训练（如举重、俯卧撑、深蹲等），并保证摄入足够的蛋白质和营养。";
      },
  
      getFitnessAdvice() {
        return "提高运动能力需要做全面的训练，包括有氧、力量训练和灵活性训练。逐渐增加训练的强度，并保持充足的休息和营养。";
      },
  
      suggestExercise() {
        if (this.userStats.activityLevel === "低") {
          return "你可以尝试一些简单的运动，比如快走、瑜伽或骑自行车，每周至少三次，每次30分钟。";
        } else if (this.userStats.activityLevel === "中") {
          return "可以尝试跑步、游泳或高强度间歇训练，每周4-5次，每次30分钟以上。";
        } else {
          return "你可以进行更多的挑战性训练，如重量训练、短时间高强度训练等。保持每周训练5-6次。";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chatbox-container {
    display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8); /* 高级磨砂黑的背景，透明度80% */
  flex-direction: column;
  margin: 0; /* 移除默认边距 */
  padding: 0; /* 移除默认内边距 */
  box-sizing: border-box; /* 确保边距不影响元素的大小 */
  }
  
  .assistant-title {
    font-size: 30px;
    font-weight: 700;
    text-align: center;
    color: #faf5f5; /* 深色文字，提升对比度 */
    margin-bottom: 20px;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1); /* 标题阴影 */
  }
  
  .chatbox {
    width: 100%;
    max-width: 500px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    padding: 25px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
  }
  
  .chatbox:hover {
    transform: scale(1.05); /* 增加动画效果 */
  }
  
  .messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* 允许纵向滚动 */
    max-height: 400px;
  }
  
  .message {
    max-width: 70%;
    padding: 12px;
    margin: 8px 0;
    border-radius: 12px;
    background-color: #f5f5f5;
    word-wrap: break-word;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 给消息添加阴影 */
  }
  
  .user-message {
    background-color: #4caf50;
    color: white;
    align-self: flex-end;
  }
  
  .assistant-message {
    background-color: #2196f3;
    color: white;
    align-self: flex-start;
  }
  
  .input-box {
    margin-bottom: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .send-btn {
    align-self: flex-end;
    background-color: #2196f3;
    border-radius: 50px;
    padding: 10px 20px;
    transition: background-color 0.3s ease;
  }
  
  .send-btn:hover {
    background-color: #1976d2;
  }
  
  @media (max-width: 600px) {
    .chatbox {
      max-width: 100%;
      padding: 15px;
    }
  
    .message {
      max-width: 100%;
    }
  }
  </style>
  