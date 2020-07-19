<template>
  <div id="app">
    <router-link v-if="$route.path != '/'" class='home-link' to="/">Home</router-link>
    <router-view/>
  </div>
</template>
