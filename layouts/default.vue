<template>
  <v-app class="app">
    <v-layout class="layout">
      <v-app-bar :elevation="1" color="green-darken-4">
        <v-container>
          <v-app-bar-title>
            Orfi Elibom
          </v-app-bar-title>
        </v-container>
      </v-app-bar>

      <v-main class="main">
        <slot></slot>
      </v-main>
    </v-layout>
  </v-app>
</template>

