<template>
    <q-page class="">
        <div class="row">
            <div class="col-2 flex justify-center items-center">
                <router-link to="/">
                    <q-btn icon="arrow_back" class="q-mb-md" />
                </router-link>
            </div>
            <div class="col-10">
                <h1>Übersicht Druckaufträge</h1>
            </div>
        </div>
        <div>
            <h2>Aktive Druckaufträge</h2>
            <ol>
                <li v-for="job in printingJobs" :key="job.id">
                    {{ job.id }} - {{ job.createdAt }} 
                    <q-btn @click="changeStatusPrintingJob(job.id, 'uploaded')" :loading="loadChangeStatus">Neuer Status: "uploaded"</q-btn>
                </li>
            </ol>
            <h2>DB Inhalt</h2>
            <h3>Jobs</h3>
            <ul>
                <li v-for="job in dbContent?.jobs" :key="job.id">
                    {{ job.id }} - {{ job.status }} - {{ job.createdAt }}
                </li>
            </ul>
            <h3>Files</h3>
            <ul>
                <li v-for="file in dbContent?.files" :key="file.id">
                    {{ file.id }}; - jobId: {{ file.jobId }};  fileCreated: {{ file.fileCreated === 1 ? 'ja' : 'nein'  }}; {{ file.createdAt }}
                </li>
            </ul>
        </div>

    </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from "quasar";

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const loadChangeStatus = ref(false)

const printingJobs = ref(null)
const dbContent = ref(null)

const loadPrintingJobs = async () => {
    try{
        const {data} = await api.get('/printing-jobs')
        console.log(data)
        printingJobs.value = data
    }catch(error){
        console.error(error)
    }
}

const loadDbContent = async () => {
    try{
        const {data} = await api.get('/db-content')
        console.log(data)
        dbContent.value = data
    }catch(error){
        console.error(error)
    }
}

const changeStatusPrintingJob = async (jobId, status) => {
    loadChangeStatus.value = true
    try{
        const response = await api.post('/update-job',{
            jobId,
            status
        })
        await loadPrintingJobs()
    }catch(error){
        console.error(error)
    }finally{
        loadChangeStatus.value = false
    }
}
loadPrintingJobs()
loadDbContent()
</script>