<template>
  <header class="flex-static">
    <hr class="horizontal-line"/>
    <nav>
      <router-link to="/">HOME</router-link>
      <hr class="vertical-line" width="0" size="15"/>
      <router-link to="/gallery">GALLERY</router-link>
      <hr class="vertical-line" width="0" size="15"/>
      <router-link to="/blog">BLOG</router-link>
    </nav>
    <hr class="horizontal-line" style="margin-top: 6px;"/>
  </header>
  <router-view/>
  <footer class="flex-static">
    <hr class="horizontal-line" style="margin-bottom: 6px;"/>
    <a target="_blank" href="https://github.com/paulsanderson/all-paul-info">
      <img class="button-small" title="Github" alt="Github" loading="lazy" src="./assets/github.png"/>
    </a>
    <hr class="vertical-line" width="0" size="15"/>
    <a target="_blank" href="https://www.linkedin.com/in/paulsandersonyup/">
      <img class="button-small" title="LinkedIn" alt="LinkedIn" loading="lazy" src="./assets/linkedin.png"/>
    </a>
    <hr class="vertical-line" width="0" size="15"/>
    <a target="_blank" href="https://instagram.com/mountain.of.youth.photos">
      <img class="button-small" title="Instagram" alt="Instagram" loading="lazy" src="./assets/instagram.png"/>
    </a>
    <hr class="vertical-line" width="0" size="15"/>
    <a target="_blank" href="https://icons8.com">
      <img class="button-small" title="Icons8" alt="Icons8" loading="lazy" src="./assets/icons8.png"/>
    </a>
    <hr class="horizontal-line" style="margin-top: 2px;"/>
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
      header {
        a {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          transform: scaleY(1.5);
          line-height: 30.5px;
          vertical-align: bottom;
          display: inline-block;
        }
        .vertical-line {
          display: inline-block;
          padding-top: 27px;
          margin: -6px 6px -11px 6px;
        }
      }
      footer {
        a {
          max-height: 25px;
        }
        .vertical-line {
          display: inline-block;
          padding-top: 25px;
          margin: -7px 6px -7px 6px;
        }
      }
      header, footer {
        background-color: $header-footer-background-color;
        .horizontal-line {
          margin: 4px 0 4px 0;
        }
      }
      button {
        cursor: pointer;
      }
      a {
        color: $link-font-color;
        font-weight: bold;
        transition: 0.5s;
        &.router-link-exact-active {
          color: $hover-link-font-color;
        }
        &:hover {
          color: $visited-link-font-color;
        }
      }
      .button-small {
        border-radius: 5px;
        cursor: pointer;
        height: 25px;
        width: 25px;
        transition: 0.5s;
        @media (hover: hover) {
          &:hover {
            opacity: 0.5;
          }
          &:active, &:focus {
            opacity: 1;
          }
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
      transition: 0.5s;
      &:not(.active) {
        color: $selected-font-color;
      }
      &:hover {
        color: $visited-link-font-color;
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
