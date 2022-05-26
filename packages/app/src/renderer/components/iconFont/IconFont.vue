<template>
    <svg class="icon" aria-hidden="true" :style="size ? { fontSize: Number(size) } : {}">
        <use :xlink:href="`#icon-${name}`"></use>
    </svg>
</template>

<script lang="ts" setup>
interface IconFontProps {
    name: string;
    size?: number | string;
}
defineProps<IconFontProps>();
</script>

<style lang="less">
.icon {
    width: 1em;
    height: 1em;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentcolor;
}
</style>
