<template>
    <div class=" p-4 flex flex-col gap-8 pt-10 flex-1">
        <div class="flex justify-between items-center">
        <p class=" font-bold text-5xl text-gray-900">Tasks</p>
        <div class="flex items-center gap-4">
            <vueInput placeholder="Search" @onChange="(data) => searchRecords(data,null)">
            <template #contentBefore><i class="ri-search-line"></i></template>
            </vueInput>
            <div class="flex gap-2 items-center">
                <VueLabel name="project">Project:</VueLabel>
                <VueSelect :options="projects" name="project" required @change="(data) => searchRecords(null,data.target.value)"></VueSelect>
            </div>
            <vueButton @clicked="createModal=true"><template #button-content>Add new task</template></vueButton>
        </div>
        </div>

        <BasicTable :columns="tableCol" :data="tasks" editMode @selected-item="(data) => openUpdateModal(data)" class=" bg-white rounded-lg border border-gray-200 flex-1 p-3"/>
    </div> 
        
    <!-- Create a record -->
    <Modal :is-visible="createModal" @close="createModal=false">
        <div class="flex flex-col gap-6">
            <p class=" text-3xl text-gray-900 font-bold min-w-96">Create a task</p>
            
            <form class=" flex flex-col gap-5" @submit.prevent="createRecord">
                <VueField labelText="Name" name="name" required></VueField>
                <div class="flex flex-col gap-0">
                    <VueLabel name="status" required>Status</VueLabel>
                    <VueSelect :options="statuses" name="status" required></VueSelect>
                </div>
                <div class="flex flex-col gap-0">
                    <VueLabel name="project" required>Project</VueLabel>
                    <VueSelect :options="projects" name="project" required></VueSelect>
                </div>
                <VueField labelText="Estimation" name="timeEstimate" type="number" required></VueField>
                
                <vueButton type="submit"><template #button-content>Save</template></vueButton>
            </form>
        </div>
    </Modal>
    
    <!-- Update the record -->
    <Modal :is-visible="updateModal" @close="updateModal=false">
        <div class="flex flex-col gap-6">
            <p class=" text-3xl text-gray-900 font-bold min-w-96">Update the task</p>
            <form class=" flex flex-col gap-5" @submit.prevent="updateRecord">
                <VueField labelText="Name" name="name" required :defaultValue="updateData.name"></VueField>
                <div class="flex flex-col gap-0">
                    <VueLabel name="status" required>Status</VueLabel>
                    <VueSelect :options="statuses" name="status" required :defaultValue="updateData.status._id"></VueSelect>
                </div>
                <div class="flex flex-col gap-0">
                    <VueLabel name="project" required>Project</VueLabel>
                    <VueSelect :options="projects" name="project" required :defaultValue="updateData.project._id"></VueSelect>
                </div>
                <VueField labelText="Estimation" name="timeEstimate" type="number" required :defaultValue="updateData.timeEstimate"></VueField>
                
                <vueButton @clicked="deleteRecord(this.updateData._id)" outline variant="neutral"><template #button-content>Delete this project</template></vueButton>
                <vueButton type="submit"><template #button-content>Save</template></vueButton>
            </form>
        </div>
    </Modal>
    
</template>
    
<script>
import { isAuthenticated, getHeaders, logOut } from "../auth/auth"
import Modal from '../components/Modal.vue';
import BasicTable from '../components/Table.vue';

import axios from 'axios';

export default {
    
    components: {
        BasicTable,
        Modal
    },
    data() {
        return {
            projects: [],
            tasks:[],
            search:{
                name:"",
                project:""
            },
            createModal: false,
            updateModal: false,
            updateData:{},
            tableCol:[
            {field:"name", label: "Name"},
            {field:"project", label: "Project", type:"chip"},
            {field:"status", label: "Status", type:"chip"},
            {field:"timeEstimate", label: "Estimation"},
            ],
            statuses:[],
            projects:[],
        };
    },
    
    mounted() {
        isAuthenticated()

        this.findTasks();
        this.getStatuses();
        this.getProjects();
    },
    
    methods: {
        findTasks(name="",project=""){
            const headers = getHeaders();
            axios.get('http://207.154.193.21:3000/api/tasks?name='+name+'&project='+project, { headers })
            .then(response => {
                this.tasks = response.data;
            })
            .catch(error => {
                if (error.response.statusText == "Unauthorized"){
                    logOut();
                }
                console.log(error);
            });
        },
        getStatuses(){
            const headers = getHeaders();
            axios.get('http://207.154.193.21:3000/api/statuses', { headers })
            .then(response => {
                this.statuses = [];
                response.data.forEach(element => {
                    this.statuses.push({value:element._id,label:element.name});
                });
            })
            .catch(error => {
                console.log(error);
            });
        },
        getProjects(){
            const headers = getHeaders();
            axios.get('http://207.154.193.21:3000/api/projects', { headers })
            .then(response => {
                this.projects = [];
                response.data.forEach(element => {
                    this.projects.push({value:element._id,label:element.name});
                });
            })
            .catch(error => {
                console.log(error);
            });
        },
        createRecord(e){
            const headers = getHeaders();
            let data = {
                name:e.target.name.value,
                project:e.target.project.value,
                status:e.target.status.value,
                timeEstimate:e.target.timeEstimate.value,
            };
            
            axios.post('http://207.154.193.21:3000/api/tasks',data, { headers })
            .then(response => {
                console.log(response.data);
                
                this.createModal = false;
                this.findTasks("");
            })
            .catch(error => {
                console.log(error);
            });
        },
        updateRecord(e){
            const headers = getHeaders();
            let data = {
                name:e.target.name.value,
                project:e.target.project.value,
                status:e.target.status.value,
                timeEstimate:e.target.timeEstimate.value,
            };
            
            axios.patch('http://207.154.193.21:3000/api/tasks/'+this.updateData._id,data, { headers })
            .then(response => {
                console.log(response.data);
                
                this.updateModal = false;
                this.findTasks("");
            })
            .catch(error => {
                console.log(error);
            });
        },
        deleteRecord(id){
            const headers = getHeaders();
            axios.delete('http://207.154.193.21:3000/api/tasks/'+id, { headers })
            .then(response => {
                this.updateModal = false;
                this.findTasks("");
            })
            .catch(error => {
                console.log(error);
            });
        },
        openUpdateModal(data){
            this.updateData = data;
            this.updateModal = true;
        },
        searchRecords(name="",project=""){
            if (name!=null) this.search.name = name;
            if (project!=null) this.search.project = project;

            this.findTasks(this.search.name,this.search.project);
        }
    }
};
    
</script>