<script setup lang="ts">
import {ref} from 'vue';
import {api} from 'boot/axios';

const printerStatus = ref({})

const loadPrinterStatus = async() => {
    try {
        const response = await api.get('/printer-status');
        console.log('Print status:', response.data);
        printerStatus.value = response.data;
    } catch (error) {
        console.error('Error loading print status:', error);
    }
}
loadPrinterStatus();
</script>
<template>
<div class="grid">
    <div class="col">
        Fragen oder Probleme? Melde dich bei Scammo
    </div>
    <div class="col">
        Druckstatus:  {{printerStatus}}
    </div>
</div>
</template>