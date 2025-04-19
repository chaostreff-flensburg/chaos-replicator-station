<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Chaos Replicator Station (CRS)
        </q-toolbar-title>

        <div>CRS v ALPHA</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <Footer/>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import Footer from 'components/Footer.vue';

const linksList: EssentialLinkProps[] = [
  {
    title: 'Github',
    caption: 'Repository MIT',
    icon: 'school',
    link: 'https://github.com/chaostreff-flensburg/chaos-replicator-station'
  },
  {
    title: 'C3FL',
    caption: 'Chaos Computer Club Flensburg e.V',
    icon: 'code',
    link: 'https://c3fl.de/'
  }
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
