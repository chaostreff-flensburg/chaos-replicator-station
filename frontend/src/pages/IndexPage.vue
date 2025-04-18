<template>
  <q-page class="">
    <h1>Was willst du heute drucken?</h1>
    <div class="grid q-pa-md">
      <template v-for="product in products" :key="product.name">
        <router-link :to="`/product/${product.slug}`">
          <ProductCard :product="product" :call-to-action="true" />
        </router-link>
      </template>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import products from 'components/products'
import ProductCard from 'components/ProductCard.vue'
</script>
