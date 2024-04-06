<template>
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th v-for="column in columns" :key="column.field" 
                    class="px-3 py-3 text-left text-sm font-bold text-gray-500">
                    {{ column.label }}</th>
                    <th v-if="editMode" class="px-3 py-3 text-left text-sm font-bold text-gray-500">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in data" :key="row.id" class=" border-b border-gray-200">
                    <td v-for="column in columns" :key="column.field" class="px-3 py-4 whitespace-nowrap text-gray-900">
                        <span v-if="column.field.includes('.')">
                            {{ renderNestedData(row, column.field)}} 
                        </span>
                        <span v-else>
                            <span v-if="column.type=='color'" class=" block w-5 h-5 rounded-full" :style="{ 'background': row[column.field] }"></span>
                            <span v-else-if="column.type=='chip'" class=" py-2 px-3 rounded-full text-sm font-bold text-gray-900" :style="{ 'background': row[column.field].color }">{{ row[column.field].name }}</span>
                            <span v-else-if="column.type=='price'">
                                {{ row[column.field] + " " + column.currency}}
                            </span>
                            <span v-else>
                                {{ row[column.field] }}
                            </span>
                        </span>
                    </td>
                    <td v-if="editMode">
                        <VueIconButton icon="ri-edit-line" variant="neutral" outline @click="$emit('selectedItem', row)"/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'BasicTable',
    props: {
        columns: {
            type: Array,
            required: true,
        },
        data: {
            type: Array,
            required: true,
        },
        editMode: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        renderNestedData(row, field) {
            const fields = field.split('.'); 
            let value = row;
            for (const field of fields) {
                value = value[field];
            }
            return value;
        },
    }
};
</script>