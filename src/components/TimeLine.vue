<template>
    <div class=" flex gap-2">
        <!-- col -->
        <div class=" flex flex-col flex-1 p-3 rounded-xl bg-gray-50 bg-opacity-25 border gap-6" v-for="item in data"  :class="{'border-primary-200':isToday(item)}">
            <div class="flex flex-col gap-1 pb-4 border-b border-gray-200">
                <p class=" text-sm text-gray-500">{{ formatDate(item.date, "dddd") }}</p>
                <p class=" text-xl font-bold text-gray-900" :class="{'text-primary-500':isToday(item)}">{{ formatDate(item.date, "DD MMMM") }}</p>
            </div>

            <div class="flex flex-col gap-2">
                <!-- card -->
                <div class="flex flex-col p-3 rounded-lg bg-white border border-gray-200 gap-1 relative" v-for="card in item.tasks">
                    <p class=" text-gray-900 font-semibold text-xl">{{ card.task.name }}</p>
                    <span class=" py-1 px-3 rounded-full text-sm font-bold text-gray-900 w-fit" :style="{ 'background': card.task.project.color }">{{ card.task.project.name }}</span>
                    <p class=" text-gray-500 text-sm">{{ card.note }}</p>
                    <div class="flex gap-1 items-center">
                        <i class="ri-time-line"></i>
                        <p class=" text-sm font-bold text-gray-500">{{ card.timeEstimate + " h." }}</p>
                    </div>

                    <vueIconButton outline variant="neutral" icon="ri-delete-bin-6-line" class=" absolute right-3 bottom-3" @clicked="$emit('deleteCard',card._id)"></vueIconButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    data(){
        return{
        }
    },
    props:{
        data:[]
    },
    methods: {
        formatDate(date,format){
            return moment(date).format(format);
        },
        isToday(data){
            let result = moment().format("DD MM YYYY") == moment(data.date).format("DD MM YYYY")
            return result
        }
    }
}
</script>