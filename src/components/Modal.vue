<template>
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
        <div v-on:click="closeModal" class="fixed inset-0 bg-black opacity-50"></div>
        
        <div class="bg-white p-8 rounded-md shadow-md relative">
            <div class="flex justify-end absolute w-full right-6">
                <vueIconButton @clicked="closeModal" type="button" icon="ri-close-line" outline variant="neutral"></vueIconButton>
            </div>
            <div class="slot">
                <slot></slot>
            </div> 
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isVisible: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>