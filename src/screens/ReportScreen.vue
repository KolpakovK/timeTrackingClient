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

        <div class="flex p-3 bg-white border border-gray-200 rounded-xl gap-4 items-center">
            <p class=" font-bold">Projects to show:</p>
            <div class=" flex-1 flex-wrap flex gap-2">
                <span v-for="project in projects" class=" py-1 px-3 rounded-full text-sm font-bold text-gray-900 w-fit flex gap-1 items-center" :style="{ 'background': project.color }">
                    {{ project.name }}
                    <vueIconButton variant="link" icon="ri-delete-bin-2-line" class="w-fit" @clicked="removeProject(project)"/>
                </span>
            </div>
        </div>

        <Report v-if="transformedData" :data="transformedData" :startDate="startDate" :endDate="endDate" class="p-3 bg-white"></Report>
    </div>


</template>

<script>
import { isAuthenticated, getHeaders, logOut } from "../auth/auth"
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
            projects:[],
        }
    },
    mounted(){
        isAuthenticated()
        this.findProjects();
    },
    methods:{
        findProjects(name=""){
            const headers = getHeaders();
            axios.get('http://207.154.193.21:3000/api/projects?name='+name, { headers })
            .then(response => {
                this.projects = response.data;
            })
            .catch(error => {
                if (error.response.statusText == "Unauthorized"){
                    logOut();
                }
                console.log(error);
            });
        },
        generateReport(){
            this.findEntries(this.startDate,this.endDate);
        },
        async findEntries(from="",to=""){
            try {
                const headers = getHeaders();
                let response = await axios.get('http://207.154.193.21:3000/api/entries?from='+from+'&to='+to, { headers });
                this.$nextTick(() => {
                    this.transformedData = this.transformData(response.data);
                });
            } catch (error){
                console.log(error);
            }
            
        },

        removeProject(project){
            const index = this.projects.indexOf(project);
            if (index > -1) { 
                this.projects.splice(index, 1); 
            }
        },
        
        transformData(data) {
            let result = []
            data.forEach(record => {
                record.tasks.forEach(timeEntry => {
                    
                    let canBeDisplayed = false;
                    this.projects.forEach(element => {
                        if (element.name == timeEntry.task.project.name) canBeDisplayed = true;
                    });

                    if (canBeDisplayed){

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
                    }
                    
                });
            });
            
            return result;
        },
    }
}
</script>