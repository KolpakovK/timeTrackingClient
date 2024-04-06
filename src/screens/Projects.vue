<template>
  <div class=" p-4 flex flex-col gap-8 pt-10 flex-1">
    <div class="flex justify-between items-center">
      <p class=" font-bold text-5xl text-gray-900">Projects</p>
      <div class="flex items-center gap-4">
        <vueInput placeholder="Search" @onChange="(data) => findProjects(data)">
          <template #contentBefore><i class="ri-search-line"></i></template>
        </vueInput>
        <vueButton @clicked="createModal=true"><template #button-content>Add new project</template></vueButton> 
      </div>
    </div>

    <BasicTable :columns="tableCol" :data="projects" editMode @selected-item="(data) => openUpdateModal(data)" class=" bg-white rounded-lg border border-gray-200 flex-1 p-3"/>

  </div>
    
    <!-- Create a record -->
    <Modal :is-visible="createModal" @close="createModal=false">
      <div class="flex flex-col gap-6">
        <p class=" text-3xl text-gray-900 font-bold min-w-96">Create a project</p>
        <form class=" flex flex-col gap-5" @submit.prevent="createRecord">
          <VueField labelText="Name" name="name" required></VueField>
          <VueField labelText="Hour rate" name="price" type="number" required></VueField>
          <div class="flex flex-col gap-0">
            <VueLabel name="color" required>Color</VueLabel>
            <VueColorSelect :options="colors" :defaultValue="colors[0]" name="color" required></VueColorSelect>
          </div>
          
          <vueButton type="submit"><template #button-content>Save</template></vueButton>
        </form>
      </div>
    </Modal>
    
    <!-- Update the record -->
    <Modal :is-visible="updateModal" @close="updateModal=false">
      <div class="flex flex-col gap-6">
        <p class=" text-3xl text-gray-900 font-bold min-w-96">Update the project</p>
        <form class=" flex flex-col gap-5" @submit.prevent="updateRecord">
          <VueField labelText="Name" name="name" required :defaultValue="updateData.name"></VueField>
          <VueField labelText="Hour rate" name="price" type="number" required :defaultValue="updateData.price"></VueField>
          <div class="flex flex-col gap-0">
            <VueLabel name="color" required>Color</VueLabel>
            <VueColorSelect :options="colors" name="color" required :defaultValue="updateData.color"></VueColorSelect>
          </div>
          
          <vueButton @clicked="deleteRecord(this.updateData._id)" outline variant="neutral"><template #button-content>Delete this project</template></vueButton>
          <vueButton type="submit"><template #button-content>Save</template></vueButton>
        </form>
      </div>
    </Modal>
  </template>
  
  <script>
  import { isAuthenticated, getHeaders } from "../auth/auth"
  
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
        createModal: false,
        updateModal: false,
        updateData:{},
        tableCol:[
        {field:"name", label: "Name"},
        {field:"price", label: "Hour rate", type: "price", currency: "€"},
        {field:"color", label: "Color", type: "color"},
        ],
        colors:[
        "#fecaca",
        "#fed7aa",
        "#fef08a",
        "#d9f99d",
        "#bbf7d0",
        "#99f6e4",
        "#bae6fd",
        "#c7d2fe",
        "#e9d5ff",
        "#fbcfe8",
        "#fecdd3",
        ]
      };
    },
    
    mounted() {
      isAuthenticated();
      this.findProjects("");
    },
    
    methods: {
      findProjects(name){
        const headers = getHeaders();
        axios.get('/api/projects?name='+name, { headers })
        .then(response => {
          this.projects = response.data;
        })
        .catch(error => {
          console.log(error);
        });
      },
      createRecord(e){
        const headers = getHeaders();
        let data = {
          name:e.target.name.value,
          price:e.target.price.value,
          color:e.target.color.value
        };
        
        axios.post('/api/projects',data, { headers })
        .then(response => {
          console.log(response.data);
          
          this.createModal = false;
          this.findProjects("");
        })
        .catch(error => {
          console.log(error);
        });
      },
      updateRecord(e){
        const headers = getHeaders();
        let data = {
          name:e.target.name.value,
          price:e.target.price.value,
          color:e.target.color.value
        };
        
        axios.patch('/api/projects/'+this.updateData._id,data, { headers })
        .then(response => {
          console.log(response.data);
          
          this.updateModal = false;
          this.findProjects("");
        })
        .catch(error => {
          console.log(error);
        });
      },
      deleteRecord(id){
        const headers = getHeaders();
        axios.delete('/api/projects/'+id, { headers })
        .then(response => {
          this.updateModal = false;
          this.findProjects("");
        })
        .catch(error => {
          console.log(error);
        });
      },
      
      openUpdateModal(data){
        this.updateData = data;
        this.updateModal = true;
      }
    }
  };
  
</script>