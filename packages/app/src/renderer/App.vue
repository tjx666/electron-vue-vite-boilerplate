<script setup lang="ts">
import WindowsControl from './components/WindowsControl.vue';

// !: electron browser is always chrome and exists platform property
const isMacOS = window.navigator.platform.toLowerCase().includes('mac');
const showWindowsControl = !isMacOS;
</script>

<template>
    <div class="app">
        <WindowsControl v-if="showWindowsControl" />
        <router-view v-slot="{ Component }">
            <keep-alive> <component :is="Component" /> </keep-alive>
        </router-view>
    </div>
</template>
