<template>
  <header class="flex-static">
    <hr/>
    <nav>
      <router-link to="/">Home</router-link> |
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
          <a target="_blank" href="https://github.com/paulsanderson/all-paul-info">GitHub</a> |
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
      .page-container {
        width: 95%;
        padding-left: 2.5%;
        padding-right: 2.5%;
        overflow-y: auto;
        scrollbar-width: thin;
      }
      header, footer {
        background-color: $header-footer-background-color;
        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
          li {
            margin: 0 5px;
            a {
              &.router-link-exact-active, &:hover {
                color: $hover-link-font-color;
              }
            }
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
    .flex-sm-gap {
      gap: 6px;
    }
    .flex-justify-center {
      justify-content: center;
    }
    .text-no-wrap {
      text-wrap: nowrap;
    }
    .collapsible-header {
      cursor: pointer;
      &:not(.active) {
        color: $selected-font-color;
      }
    }
    .collapsible-content {
      display: none;
      &.active {
        display: block;
      }
    }
  }
}
</style>
