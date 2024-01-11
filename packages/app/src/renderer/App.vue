<template>
    <div class="app">
        <div class="titlebar"></div>
        <router-view v-slot="{ Component }">
            <keep-alive> <component :is="Component" /> </keep-alive>
        </router-view>
    </div>
</template>
