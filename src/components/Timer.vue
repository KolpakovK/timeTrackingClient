<template>
    <!-- timer -->
    <div class="flex p-3 bg-white border border-gray-200 rounded-xl gap-4 items-center">
        <p class=" font-bold">Run timer:</p>
        <vueInput placeholder="What do you want to do?" class=" flex-1 border-none" ref="note"></vueInput>
        <span v-if="selectedTask" class=" py-1 px-3 rounded-full text-sm font-bold text-gray-900 w-fit bg-gray-100 flex gap-1 items-center">
            {{ selectedTask.name }}
            <vueIconButton variant="link" icon="ri-delete-bin-2-line" class="w-fit" @clicked="selectedTask = null"/>
        </span>
        <vueButton v-else outline variant="neutral" @clicked="selectTaskModal=true"><template #button-content>Select task</template></vueButton>
        <div class=" h-full border-r border-gray-200"></div>

        <p class=" text-xl font-bold text-gray-900">{{ formatTime() }}</p>
        <vueIconButton v-if="isRunning" outline icon="ri-stop-fill" @clicked="stop"/>

        <vueIconButton v-if="!isRunning" :disabled="selectedTask == null" icon="ri-play-fill" @clicked="start"/>
    </div>

    <!-- Select a task for timer -->
    <Modal :is-visible="selectTaskModal" @close="selectTaskModal=false">
        <div class="flex flex-col gap-6">
            <p class=" text-3xl text-gray-900 font-bold min-w-[550px]">Select a task</p>
            <vueField labelText="Search" @changed="(data) => findTasks(data)"></vueField>
            <BasicTable :columns="tableCol" :data="tasks" editMode class=" max-h-[550px]" @selected-item="(data) => pickTask(data)"/>
        </div>
    </Modal>

</template>

<script>
import Modal from '../components/Modal.vue';
import BasicTable from '../components/Table.vue';
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format';

export default{
    components: {
        Modal,
        BasicTable
    },
    data(){
        return{
            selectTaskModal: false,
            selectedTask:null,
            isRunning:false,
            time:0,
            interval:0
        }
    },
    props:{
        tasks: [],
        tableCol: [],
    },
    methods:{
        pickTask(data){
            this.selectedTask = data;
            this.selectTaskModal = false;
        },
        start(){
            this.time = 0;
            this.isRunning = true
            this.interval = setInterval( ()=> {
                this.time += 1;
            }, 1000)
        },
        stop(){
            this.isRunning = false;
            clearInterval(this.interval);

            let data = {
                note:this.$refs.note.value,
                date:moment().format('YYYY-MM-DD'),
                task:this.selectedTask._id,
                timeEstimate:this.roundToIdeal(this.time / 3600),
            }

            if (data.timeEstimate != 0){
                this.$emit("timerStoped",data)
            }
            else{

            }
        },
        formatTime(){
            momentDurationFormatSetup(moment);
            return moment.duration(this.time, 'seconds').format('HH:mm:ss');
        },
        roundToIdeal(num) {
            const idealValues = [0.25, 0.5, 0.75];
            const closestIdeal = idealValues.reduce((a, b) => Math.abs(b - num) < Math.abs(a - num) ? b : a);
            return Math.round(num * 4) / 4 === closestIdeal ? closestIdeal : Math.round(num);
        }
    }
}
</script>