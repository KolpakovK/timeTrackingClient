<template>
    <div class=" p-4 flex flex-col gap-8 pt-10 flex-1">
        <div class="flex justify-between items-center">
            <p class=" font-bold text-5xl text-gray-900">Time tracking</p>
            <div class="flex items-center gap-4">
                <div class="flex gap-2 items-center">
                    <vueIconButton icon="ri-arrow-drop-left-line" outline variant="neutral" @clicked="changeDate(-1)"/>
                    <p>{{ this.currentDate.clone().startOf('week').format('DD MMMM') }}</p>
                    <vueIconButton icon="ri-arrow-drop-right-line" outline variant="neutral" @clicked="changeDate(1)"/>
                </div>
                <vueButton @clicked="selectTaskModal=true"><template #button-content>Track time</template></vueButton>
            </div>
        </div>

        <Timer :tableCol="tableCol" :tasks="tasks" @timerStoped="(data) => createRecord(null,data)"></Timer>

        <TimeLine :data="entries" class=" flex-1" @deleteCard="(data) => deleteRecord(data)"></TimeLine>
    </div>

    <!-- Select a task -->
    <Modal :is-visible="selectTaskModal" @close="selectTaskModal=false">
        <div class="flex flex-col gap-6">
            <p class=" text-3xl text-gray-900 font-bold min-w-[550px]">Choose a task to track it</p>
            <vueField labelText="Search" @changed="(data) => findTasks(data)"></vueField>
            <BasicTable :columns="tableCol" :data="tasks" editMode class=" max-h-[550px]" @selected-item="(data) => pickTask(data)"/>
        </div>
    </Modal>

    <!-- Create a record -->
    <Modal :is-visible="createModal" @close="createModal=false">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <p class=" text-3xl text-gray-900 font-bold min-w-96">Log your time</p>
                <p class=" text-gray-500">
                    Selected task:
                    <span class=" font-bold text-gray-900">
                        {{ selectedTask.name }}
                    </span>
                </p>
            </div>
            
            <form class=" flex flex-col gap-5" @submit.prevent="createRecord">
                <VueField labelText="Note" name="note" type="textarea"></VueField>
                <VueField labelText="Date" name="date" type="date"></VueField>
                <VueField labelText="Estimation" name="timeEstimate" type="number" required></VueField>
                
                <vueButton type="submit"><template #button-content>Save</template></vueButton>
            </form>
        </div>
    </Modal>

</template>

<script>
import { isAuthenticated, getHeaders, logOut } from "../auth/auth"
import moment from 'moment'
import Modal from '../components/Modal.vue';
import TimeLine from '../components/TimeLine.vue';
import BasicTable from '../components/Table.vue';
import Timer from '../components/Timer.vue';

import axios from 'axios';

export default{
    components: {
        TimeLine,
        Modal,
        BasicTable,
        Timer
    },
    data(){
        return{
            entries:[],
            currentDate:moment(),
            selectTaskModal: false,
            selectedTask:{},
            createModal:false,
            tableCol:[
                {field:"name", label: "Name"},
                {field:"project", label: "Project", type:"chip"},
            ],
            tasks:[],
        }
    },
    mounted() {
        isAuthenticated()

        const startOfWeek = this.currentDate.clone().startOf('week').format('YYYY-MM-DD');
        const endOfWeek = this.currentDate.clone().endOf('week').format('YYYY-MM-DD');
        this.findEntries(startOfWeek,endOfWeek);
        this.findTasks();
    },
    methods: {
        findEntries(from="",to=""){
            const headers = getHeaders();
            axios.get('http://207.154.193.21:3000/api/entries?from='+from+'&to='+to, { headers })
            .then(response => {
                this.entries = response.data;
                if (from && to){
                    this.entries = this.processData(response.data,from,to);
                }
            })
            .catch(error => {
                if (error.response.statusText == "Unauthorized"){
                    logOut();
                }
                console.log(error);
            });
        },
        
        processData(data, startDate, endDate) {
            const allDates = [];
            let currentDate = moment(startDate).clone();

            // Создание списка всех дат в заданном диапазоне
            while (currentDate <= moment(endDate)) {
                allDates.push(currentDate.format('YYYY-MM-DD'));
                currentDate.add(1, 'day');
            }

            // Обработка полученных данных и добавление отсутствующих дней
            const result = allDates.map((date) => {
                const existingEntry = data.find(entry => entry.date === date);

                return existingEntry || { date, tasks: [] };
            });

            return result;
        },

        changeDate(offset){
            if (offset>0) this.currentDate.add(7,"days");  
            if (offset<=0) this.currentDate.subtract(7,"days");

            const startOfWeek = this.currentDate.clone().startOf('week').format('YYYY-MM-DD');
            const endOfWeek = this.currentDate.clone().endOf('week').format('YYYY-MM-DD');
            this.findEntries(startOfWeek,endOfWeek);
        },

        findTasks(name="",project=""){
            const headers = getHeaders();
            axios.get('http://207.154.193.21:3000/api/tasks?name='+name+'&project='+project+'&limit=5', { headers })
            .then(response => {
                this.tasks = response.data;
            })
            .catch(error => {
                console.log(error);
            });
        },

        createRecord(e,model=null){
            const headers = getHeaders();
            let data;
            if (e!=null){
                data = {
                    note:e.target.note.value,
                    date:e.target.date.value,
                    task:this.selectedTask._id,
                    timeEstimate:e.target.timeEstimate.value,
                };
            }
            else{
                data = model;
            }
            
            axios.post('http://207.154.193.21:3000/api/entries',data, { headers })
            .then(response => {
                console.log(response.data);
                
                this.createModal = false;

                const startOfWeek = this.currentDate.clone().startOf('week').format('YYYY-MM-DD');
                const endOfWeek = this.currentDate.clone().endOf('week').format('YYYY-MM-DD');
                this.findEntries(startOfWeek,endOfWeek);
            })
            .catch(error => {
                console.log(error);
            });
        },

        deleteRecord(id){
            const headers = getHeaders();
            axios.delete('http://207.154.193.21:3000/api/entries/'+id, { headers })
            .then(response => {
                const startOfWeek = this.currentDate.clone().startOf('week').format('YYYY-MM-DD');
                const endOfWeek = this.currentDate.clone().endOf('week').format('YYYY-MM-DD');
                this.findEntries(startOfWeek,endOfWeek);
            })
            .catch(error => {
                console.log(error);
            });
        },

        pickTask(data){
            this.selectedTask = data;
            this.selectTaskModal = false;
            this.createModal = true
        }
    }
}
</script>