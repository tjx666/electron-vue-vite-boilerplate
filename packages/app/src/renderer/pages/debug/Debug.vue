<template>
    <div class="debug-page">
        <h2 class="title">调试页</h2>
        <a-button @click="checkVersionInfo">查看版本信息</a-button>
        <a-modal
            class="debug-info-modal"
            :visible="showInfoModal"
            :width="600"
            :footer="null"
            @cancel="handleCancelInfoModal"
        >
            <div class="item-wrapper">
                <span>app 版本</span>
                <span>{{ info.appVersion }}</span>
            </div>
            <div class="item-wrapper">
                <span>开发环境: </span>
                <span>{{ chineseDevModeName }}</span>
            </div>
            <div class="item-wrapper">
                <span>打包时间: </span>
                <span>{{ info.packDateTime }}</span>
            </div>
            <div class="item-wrapper">
                <span>Git Commit: </span>
                <span>{{ info.packGitCommit }}</span>
            </div>
            <div class="item-wrapper">
                <span>操作系统: </span>
                <span>{{ info.systemName }}</span>
            </div>
            <div class="item-wrapper">
                <span>内核版本: </span>
                <span>{{ info.kernelVersion }}</span>
            </div>
            <div class="item-wrapper">
                <span>Electron 版本: </span>
                <span>{{ info.electronVersion }}</span>
            </div>
            <div class="item-wrapper">
                <span>Chromium 版本: </span>
                <span>{{ info.chromeVersion }}</span>
            </div>
            <div class="item-wrapper">
                <span>Node 版本: </span>
                <span>{{ info.nodeVersion }}</span>
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const info = ref<Record<string, string>>({});
const showInfoModal = ref(false);
const chineseDevModeName = computed(() => {
    if (info.value.devMode) {
        const mapper: Record<string, string> = {
            development: '开发模式',
            test: '测试模式',
            production: '生产模式',
        };
        return mapper[info.value.devMode as string];
    }
    return '';
});

async function checkVersionInfo() {
    info.value = await ipcRenderer.invoke('common.app.about');
    showInfoModal.value = true;
}

function handleCancelInfoModal() {
    showInfoModal.value = false;
}
</script>

<style lang="less">
.debug-page {
    padding: 20px 10px 10px;
    .title {
        text-align: center;
    }
}

.debug-info-modal {
    .item-wrapper {
        span {
            display: inline-block;
        }

        :first-child {
            width: 120px;
            color: black;
            text-align: right;
        }

        :last-child {
            margin-bottom: 10px;
            margin-left: 1em;
        }
    }
}
</style>
