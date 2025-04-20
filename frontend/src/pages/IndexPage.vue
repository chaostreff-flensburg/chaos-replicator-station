<template>
  <q-page class="">
    <h1>Was willst du heute drucken?</h1>
    <div class="grid q-pa-md">
      <template v-for="product in products" :key="product.name">
        <router-link :to="`/product/${product.slug}`">
          <ProductCard :product="product" :call-to-action="true" />
        </router-link>
      </template>
      <div class="col-6">
        <h2>Info zum Druck</h2>
        <template v-if="printerStatus">
          <BtnCleanPlate :jobId="printerStatus.firstPrintingJob.id"/>
        </template>
        <pre>{{ printerStatus }}</pre>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import products from 'components/products'
import ProductCard from 'components/ProductCard.vue'
import BtnCleanPlate from 'components/BtnCleanPlate.vue'

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
