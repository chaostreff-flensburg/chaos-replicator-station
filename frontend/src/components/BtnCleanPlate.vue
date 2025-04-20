<template>
    <q-btn
      class="q-ma-md"
      color="primary"
      @click="confirm"
      >Platte vom 3D-Drucker ist frei</q-btn>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  jobId: {
    type: Number,
    required: true
  }
})

const confirm =  () => {
      $q.dialog({
        title: 'Bestätigung',
        message: 'Ist die Platte wirklich frei? Befinden sich keine Objekte oder weiße Reste auf der Platte vom oberen Drucker?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        await changeStatusPrintingJob(props.jobId, 'completed')
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
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
</script>