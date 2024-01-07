<script lang="ts" setup>
import { ref } from 'vue';

const isFullScreen = ref(false);

function handleMin() {
    ipcRenderer.invoke('common.windowsControl', 'min');
}

function handleToggleFull() {
    ipcRenderer.invoke('common.windowsControl', 'toggleFull');
    isFullScreen.value = !isFullScreen.value;
}

function handleClose() {
    ipcRenderer.invoke('common.windowsControl', 'close');
}
</script>

<template>
    <div class="windows-control">
        <icon-font class="icon-min" name="Minus" @click="handleMin" />
        <icon-font
            class="icon-full-screen"
            :name="isFullScreen ? 'win-unfull' : 'full'"
            @click="handleToggleFull"
        />
        <icon-font class="icon-close" name="win-close" @click="handleClose" />
    </div>
</template>

<style>
.windows-control {
    width: 76px;
    height: 24px;

    .icon {
        font-size: 24px;
        color: rgb(127 135 146 / 100%);
        -webkit-app-region: no-drag;

        &:hover {
            color: rgb(28 30 32 / 100%);
        }

        &:not(:last-child) {
            margin-right: 2px;
        }
    }
}
</style>
