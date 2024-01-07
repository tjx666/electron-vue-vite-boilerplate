<script setup lang="ts">
import WindowsControl from 'components/windowsControl/WindowsControl.vue';

const showWindowsControl = !api.env.isMacOS;
</script>

<template>
    <div class="app">
        <WindowsControl v-if="showWindowsControl" />
        <router-view v-slot="{ Component }">
            <keep-alive> <component :is="Component" /> </keep-alive>
        </router-view>
    </div>
</template>
