<template>
    <q-page class="">
        <div class="row">
            <div class="col-2 flex justify-center items-center">
                <router-link to="/">
                    <q-btn icon="arrow_back" class="q-mb-md" />
                </router-link>
            </div>
            <div class="col-10">
                <h1>Druckauftrag erstellen</h1>
            </div>
        </div>
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
            <q-step :name="1" title="Konfiuguration" icon="settings" :done="step > 1">
                <div class="row q-pa-md">
                    <div class="col-4">
                        <h2>Ausgewähltes Model</h2>
                        <ProductCard v-if="product" :product="product" :call-to-action="false" />
                    </div>
                    <div class="col-8">
                        <h2>Konfigurieren</h2>
                        <q-form @submit="submitConfiguration()">
                            <template v-for="field in product?.fields" :key="field.name">
                                <q-input v-if="field.type === 'text'" v-model="configurationForm[field.name]"
                                    :label="field.label" :type="field.type" />
                                <q-input v-else-if="field.type === 'number'" v-model.number="configurationForm[field.name]"
                                    :label="field.label" :type="field.type" />

                            </template>
                            <q-btn type="submit" label="Jetzt Drucken" class="q-mt-md" />
                        </q-form>
                    </div>
                </div>
            </q-step>

            <q-step :name="2" title="Druckauftrag Bestätigen" caption="Optional" icon="create_new_folder"
                :done="step > 2">
                <h2>Druckaufstrag bestätigen</h2>
                <b>Konfiguration:</b>
                <ul>
                    <li v-for="(value, key) in configurationForm" :key="key">
                        {{product?.fields.find((field) => field.name === key)?.label || key}}: "{{ value.toUpperCase() }}"
                    </li>
                </ul>
                <q-btn label="Jetzt Drucken" @click="submitPringJobRequest()" :loading="loading" />
            </q-step>

            <q-step :name="3" title="Abschluss Druckauftrag" icon="assignment">
                <div v-if="printJobResult.success">
                    <h2>Druckauftrag erfolgreich erstellt</h2>
                    <p>Auftragsnummer: {{ printJobResult?.data?.file?.id }}</p>
                    <p>Auftragsstatus: Erstellt</p>
                </div>
                    <RouterLink to="/">
                        <q-btn label="Zur Startseite"/>
                    </RouterLink>
            </q-step>

            <template v-slot:navigation>
                <q-stepper-navigation>
                    <!--<q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />-->
                    <q-btn v-if="step > 1 && step !== 3" flat color="primary" @click="$refs.stepper.previous()" label="Zurück"
                        class="q-ml-sm" />
                </q-stepper-navigation>
            </template>
        </q-stepper>

    </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from "quasar";

import ProductCard from 'src/components/ProductCard.vue';
import products from 'src/components/products';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const step = ref(1);
const showConfirmDialog = ref(false);
// eslint-disable-next-line
const configurationForm = ref<Record<string, any>>({});
const loading = ref(false);

const printJobResult = ref({});

const product = products.find((product) => product.slug === route.params.slug);


if (!product) {
    router.push('/404');
}

const submitConfiguration = () => {

    step.value = 2;
}
const submitPringJobRequest = async () => {
    loading.value = true;
    try {
        const response = await api.post('/print-jobs', {
            product: product?.slug,
            configuration: configurationForm.value,
        });
        printJobResult.value = {
            success: true,
            data: response.data
        }
        console.log(printJobResult.value);
        $q.notify({
            message: "Druckauftrag wurde erstellt",
            color: "positive",
            icon: "",
        });
    } catch (error) {
        console.error('Error creating print job:', error);
        $q.notify({
            message: "Fehler beim Erstellen des Druckauftrags",
            color: "negative",
            icon: "warning",
        });

        printJobResult.value = {
            success: false,
            data: error
        }
    } finally {
        showConfirmDialog.value = false;
        loading.value = false;
        step.value = 3;
    }
}
</script>