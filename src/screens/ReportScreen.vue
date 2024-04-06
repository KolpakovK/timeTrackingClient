<template>
    <div class=" p-4 flex flex-col gap-8 pt-10 flex-1">
        <div class="flex justify-between items-center">
            <p class=" font-bold text-5xl text-gray-900">Report</p>
            <div class="flex items-end gap-4">
                <VueField labelText="Date start" name="dateStart" type="date" @change=" e => startDate = (e.target.value)"></VueField>
                <VueField labelText="Date end" name="dateEnd" type="date" @change=" e => endDate = (e.target.value)"></VueField>
                <vueButton @clicked="generateReport()"><template #button-content>Generate a report</template></vueButton>
            </div>
        </div>

        <Report v-if="transformedData" :data="transformedData" :startDate="startDate" :endDate="endDate" class="p-3 bg-white"></Report>
    </div>

</template>

<script>
import { isAuthenticated, getHeaders } from "../auth/auth"
import moment from 'moment'
import axios from 'axios';

import Report from '../components/Report.vue';

export default{
    components:{
        Report
    },
    data(){
        return{
            transformedData:null,
            startDate:moment(),
            endDate:moment(),
        }
    },
    mounted(){
        isAuthenticated()
    },
    methods:{
        generateReport(){
            this.findEntries(this.startDate,this.endDate);
        },
        async findEntries(from="",to=""){
            try {
                const headers = getHeaders();
                let response = await axios.get('/entries?from='+from+'&to='+to, { headers });
                this.$nextTick(() => {
                    this.transformedData = this.transformData(response.data);
                });
            } catch (error){
                console.log(error);
            }
            
        },
        
        transformData(data) {
            let result = []
            data.forEach(record => {
                record.tasks.forEach(timeEntry => {
                    
                    let projectIndex = result.findIndex(p => p.project === timeEntry.task.project.name);
                    if (projectIndex == -1){
                        result.push({
                            project: timeEntry.task.project.name,
                            price: timeEntry.task.project.price,
                            tasks:[]
                        })
                        projectIndex = result.findIndex(p => p.project === timeEntry.task.project.name);
                    }
                    
                    let taskName = timeEntry.task.name
                    let taskIndex = (result[projectIndex].tasks.findIndex(t => t.name === taskName));
                    
                    if (taskIndex == -1){
                        result[projectIndex].tasks.push({
                            name: taskName,
                            status: timeEntry.task.status,
                            timeEstimate: timeEntry.task.timeEstimate,
                            time: [{
                                date: timeEntry.date,
                                note: timeEntry.note,
                                timeEstimate: timeEntry.timeEstimate
                            }],
                            timeSpent: timeEntry.timeEstimate
                        })
                    }
                    else{
                        result[projectIndex].tasks[taskIndex].time.push({
                            date: timeEntry.date,
                            note: timeEntry.note,
                            timeEstimate: timeEntry.timeEstimate
                        });
                        result[projectIndex].tasks[taskIndex].timeSpent += timeEntry.timeEstimate;
                    }
                    
                });
            });
            
            return result;
        },
    }
}
</script>