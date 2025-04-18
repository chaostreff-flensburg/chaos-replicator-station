<template>
    <q-card class="my-card col-4" style="max-width: 400px;">
            <q-card-section>
              <q-img :src="product.images[0].url" class="my-card-image" />
              <h2>{{ product.name }}</h2>
              <p>{{ product.description }}</p>
            </q-card-section>
            <q-card-actions>
              <q-btn color="primary" label="Jetzt Drucken" v-if="callToAction" />
            </q-card-actions>
          </q-card>
    </template>
    <script setup lang="ts">
    import type {Product} from './models';

defineProps<{
        product: Product,
        callToAction: boolean
}>()
    </script>