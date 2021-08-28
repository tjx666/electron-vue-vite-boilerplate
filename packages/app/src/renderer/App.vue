<template>
    <div class="app">
        <windows-control v-if="showWindowsControl" />
        <router-view v-slot="{ Component }">
            <keep-alive> <component :is="Component" /> </keep-alive>
        </router-view>
    </div>
</template>
<script setup lang="ts">
import WindowsControl from 'components/windowsControl/WindowsControl.vue';
const showWindowsControl = !api.env.isMacOS;
</script>
