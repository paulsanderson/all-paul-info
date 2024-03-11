<template>
  <header class="flex-static">
    <hr/>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/jokes">Jokes</router-link> |
      <router-link to="/projects">Projects</router-link> |
      <router-link to="/gallery">Gallery</router-link> |
      <router-link to="/blog">Blog</router-link>
    </nav>
    <!-- TODO: add language support to header -->
    <hr/>
  </header>
  <router-view/>
  <footer class="flex-static">
      <hr/>
      <ul>
        <li>
          <a target="_blank" href="https://github.com/paulsanderson">GitHub</a> |
          <a target="_blank" href="https://www.linkedin.com/in/paulsandersonyup/">LinkedIn</a> |
          <a target="_blank" href="https://instagram.com/mountain.of.youth.photos">Instagram</a>
        </li>
      </ul>
      <hr/>
  </footer>
</template>

<style lang="scss">
@import "@/utilities/constants";
html {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: $body-background-color;
  color: $font-color;
  body {
    height: 100%;
    margin: 0;
    #app {
      text-align: center;
      ::selection {
        color: $selected-font-color;
      }
      > .flex-container {
        overflow-y: auto;
      }
      .width-100 {
        width: 100%;
        padding-left: 0;
        padding-right: 0;
      }
      .width-95 {
        width: 95%;
        padding-left: 2.5%;
        padding-right: 2.5%;
      }
      .width-90 {
        width: 90%;
        padding-left: 5%;
        padding-right: 5%;
      }
      .width-80 {
        width: 80%;
        padding-left: 10%;
        padding-right: 10%;
      }
      .overflow-y {
        overflow-y: auto;
      }
      header, footer {
        background-color: $header-footer-background-color;
        a {
          &.router-link-exact-active, &:hover {
            color: $hover-link-font-color;
          }
        }
      }
      button {
        cursor: pointer;
      }
      a {
        color: $link-font-color;
        font-weight: bold;
        transition: 0.5s;
        &:hover {
          color: $hover-link-font-color;
        }
        &:visited {
          color: $visited-link-font-color;
        }
      }
      h1,h2 {
        transition: 0.5s;
        &:hover {
          color: $hover-link-font-color;
        }
      }
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        li {
          margin: 0 5px;
        }
      }
      .button-large {
        font-size: 24px;
        height: 50px !important;
        outline: none;
        border: 2px solid black;
        border-radius: 8px;
        transition: 0.5s;
        &:hover, &:focus {
          border: 2px solid $hover-link-font-color;
        }
        @media screen and (max-width: $small) {
          font-size: 14px;
        }
      }
      .button-small {
        font-size: 18px;
        background-color: $font-color;
        border-radius: 5px;
        cursor: pointer;
        height: 25px;
        width: 25px;
        padding: 1px 0 1px 0;
        transition: 0.5s;
        &:hover, &:focus {
          background-color: $selected-font-color;
        }
        &:disabled {
          cursor: inherit !important;
          background-color: $selected-font-color;
        }
      }
    }
    .flex-container {
      height: 100%;
      display: flex;
      .flex-static {
        flex: 0 0 0;
      }
      .flex-dynamic {
        flex: 1 1 auto;
      }
    }
    .flex-column {
      flex-flow: column nowrap;
    }
    .flex-row {
      flex-flow: row nowrap;
    }
    .flex-wrap {
      flex-wrap: wrap;
    }
    .flex-gap {
      gap: 10px;
    }
    .flex-justify-center {
      justify-content: center;
    }
    .flex-justify-space-between {
      justify-content: space-between;
    }
    .text-no-wrap {
      text-wrap: nowrap;
    }
  }
}
</style>
