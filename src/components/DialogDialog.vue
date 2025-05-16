<template>
  <div v-if="isOpen" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-box" role="dialog" aria-labelledby="dialog-title" @keydown.esc="closeDialog">
      <header class="dialog-header">
        <h3 id="dialog-title">{{ title }}</h3>
        <button @click="closeDialog" class="close-btn" aria-label="Close dialog">&times;</button>
      </header>
      <main class="dialog-body">
        <slot></slot>
      </main>
      <footer class="dialog-footer">
        <button @click="closeDialog" class="btn cancel">Cancel</button>
        <button @click="confirmAction" class="btn confirm">Confirm</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Dialog",
    },
  },
  emits: ["close", "confirm"],
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    confirmAction() {
      this.$emit("confirm");
    },
  },
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.dialog-box {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 900px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: fadeIn 0.3s ease-in-out;
  outline: none;
}

.dialog-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff;
  color: white;
  border-radius: 10px 10px 0 0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.dialog-body {
  padding: 20px;
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.dialog-footer .btn {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  margin-left: 10px;
  transition: background-color 0.3s;
}

.dialog-footer .cancel {
  background-color: #f8f9fa;
  color: #007bff;
}

.dialog-footer .cancel:hover {
  background-color: #e2e6ea;
}

.dialog-footer .confirm {
  background-color: #28a745;
  color: white;
}

.dialog-footer .confirm:hover {
  background-color: #218838;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
