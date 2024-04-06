<template>
    <div class="flex flex-col gap-2">
        <vueButton @clicked="convertHtmlToPdf" outline><template #button-content>Download report</template></vueButton>
        <div class=" flex flex-col gap-6" id="reportDiv">
            <div class="flex justify-between items-center">
                <h1 class=" text-3xl font-bold text-gray-900">Report - from {{ formatDate(startDate,"DD.MM.YY") }} to {{ formatDate(endDate,"DD.MM.YY") }}</h1>
                <p class=" px-4 py-1 rounded-full bg-green-200 font-bold text-2xl text-green-800">{{ countSum(data) + " €" }}</p>
            </div>
            <div v-for="project in data" class=" flex flex-col gap-4">
                <h2 class=" text-2xl font-bold text-gray-900 p-3 rounded bg-white border border-gray-200">{{ project.project }}</h2>
                
                <div class="min-w-full p-3 bg-white border border-gray-200 rounded-md">
                    
                    <div class="flex w-full border-b border-gray-200">
                        <span class="w-1/6 px-3 py-3 text-left text-sm font-bold text-gray-500">
                            Task
                        </span>
                        <span class="w-1/6 px-3 py-3 text-left text-sm font-bold text-gray-500">
                            Status
                        </span>
                        <span class="w-1/6 px-3 py-3 text-left text-sm font-bold text-gray-500">
                            Estimation
                        </span>
                        <span class="w-1/6 px-3 py-3 text-left text-sm font-bold text-gray-500">
                            Time spent
                        </span>
                        <span class="w-1/6 px-3 py-3 text-left text-sm font-bold text-gray-500">
                            Hour rate
                        </span>
                        <span class="w-1/6 px-3 py-3 text-left text-sm font-bold text-green-800">
                            To pay
                        </span>
                    </div>
                    
                    
                    <div v-for="task in project.tasks" class=" flex flex-col mb-4">
                        <div class=" w-full flex">
                            <span class="w-1/6 px-3 py-4  text-gray-900">{{ task.name }}</span>
                            <span class="w-1/6 px-3 py-4  text-gray-900">
                                <span class=" py-2 px-3 rounded-full text-sm font-bold text-gray-900" :style="{ 'background': task.status.color }">{{ task.status.name }}</span>
                            </span>
                            <span class="w-1/6 px-3 py-4  text-gray-900">{{ task.timeEstimate }}</span>
                            <span class="w-1/6 px-3 py-4  text-gray-900" :class="{'text-primary-500 font-bold': (task.timeSpent>task.timeEstimate)}">{{ task.timeSpent }}</span>
                            <span class="w-1/6 px-3 py-4  text-gray-900">{{ project.price + " €" }}</span>
                            <span class="w-1/6 px-3 py-4  font-bold text-green-600">{{ task.timeSpent*project.price + " €" }}</span>
                        </div>
                        <div class=" w-full rounded-md bg-green-100 bg-opacity-30 p-3">
                            <div class="flex flex-col w-full">
                                <div class=" flex w-full">
                                    <span class="w-1/6"></span>
                                    <span class="w-1/6 px-3 py-4 text-sm font-medium text-gray-500">Date</span>
                                    <span class="w-2/6 px-3 py-4 text-sm font-medium text-gray-500">Note</span>
                                    <span class="w-1/6 px-3 py-4 text-sm font-medium text-gray-500">Time spent</span>
                                    <span class="w-1/6 px-3 py-4 text-sm font-medium text-gray-500">To pay</span>
                                </div>
                                <div v-for="time in task.time" class=" flex w-full">
                                    <span class="w-1/6"></span>
                                    <span class="w-1/6 px-3 py-4 text-gray-900">{{ formatDate(time.date,"DD MMMM YY") }}</span>
                                    <span class="w-2/6 px-3 py-4 text-gray-900">{{ time.note }}</span>
                                    <span class="w-1/6 px-3 py-4 text-gray-900">{{ time.timeEstimate }}</span>
                                    <span class="w-1/6 px-3 py-4 font-bold text-gray-900">{{ time.timeEstimate * project.price + " €" }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import html2pdf from 'html2pdf.js';

export default{

    props:{
        data:{
            type: Array,
            required: true,
        },
        startDate:{
            type: Date,
            default: moment()
        },
        endDate:{
            type: Date,
            default: moment()
        },
    },
    mounted() {
    },
    methods:{
        formatDate(date,format){
            return moment(date).format(format);
        },
        countSum(dataArr){
            let sum = 0;
            dataArr.forEach(project => {
                project.tasks.forEach(task => {
                    sum += task.timeSpent*project.price;
                });
            });
            return sum
        },
        async convertHtmlToPdf() {
            var element = document.getElementById('reportDiv');
            var opt = {
                margin:       0.25,
                filename:     'report.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf(element, opt);
        }
    }
}
</script>