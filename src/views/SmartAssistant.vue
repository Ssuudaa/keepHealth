<template>
  <div class="chatbox-container">
    <!-- 标题 -->
    <div class="assistant-title">这里是智能助手，有什么可以帮助您</div>

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
        <span v-html="msg.text.replace(/\n/g, '<br>')"></span>
      </div>

        <!-- AI 等待回复时的提示 -->
        <div v-if="isThinking" class="message assistant-message">
          <span>正在思考...</span>
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
import api from "../api";

export default {
  data() {
    return {
      userInput: "",
      messages: [],
      isThinking: false, // AI 是否在思考
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      // 添加用户消息
      this.messages.push({ from: "user", text: this.userInput });

      const userMessage = this.userInput;
      this.userInput = "";

      // 显示“正在思考...”的提示
      this.isThinking = true;

      try {
        const response = await api.post("/chat", { input: userMessage }, { timeout: 240000 }); // 2分钟超时

        // 假设 API 返回 { code: 200, msg: "AI的回复" }
        if (response.code === 200) {
          this.messages.push({ from: "assistant", text: response.msg });
          console.log(response.msg)
        } else {
          this.messages.push({ from: "assistant", text: "AI 没有正确响应，请稍后重试。" });
        }
      } catch (error) {
        console.error("AI 请求失败", error);
        this.messages.push({ from: "assistant", text: "请求 AI 失败，请稍后重试。" });
      } finally {
        this.isThinking = false; // 请求完成后隐藏“正在思考...”提示
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
  background: rgba(0, 0, 0, 0.8);
  flex-direction: column;
}

.assistant-title {
  font-size: 30px;
  font-weight: 700;
  text-align: center;
  color: #faf5f5;
  margin-bottom: 20px;
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
}

.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  max-height: 400px;
}

.message {
  max-width: 70%;
  padding: 12px;
  margin: 8px 0;
  border-radius: 12px;
  background-color: #f5f5f5;
  word-wrap: break-word;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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
}

.send-btn:hover {
  background-color: #1976d2;
}
</style>
