<template>
  <div class="flex-dynamic flex-container flex-column width-full" style="overflow-y: auto">
    <h1 class="flex-static">Paul Sanderson</h1>
    <div class="flex-container flex-row">
      <div class="flex-dynamic">
        <h2 class="collapsible-header active" @click="(event) => onClickCollapse(event)">About</h2>
        <div class="collapsible-content active">
          <div class="flex-container flex-row flex-gap">
            <img class="flex-dynamic large-image" width="266" height="400" style="object-fit: cover; aspect-ratio: 0.665" title="Paul Sanderson" alt="Paul Sanderson" src="../assets/paulsanderson.webp"/>
            <div class="flex-dynamic align-left">
              This is the personal page for Paul Sanderson. He is a software developer in Bozeman, Montana, USA.
              Paul enjoys photography, DIY projects, mountain biking, guitar, chess, and a variety of studies like economics, linguistics, and history.
              This site was built from scratch and is intended to always be a work in progress. Eventually, it will host photography, projects, and a blog. Feedback is welcome.
            </div>
          </div>
        </div>
        <h2 class="collapsible-header" @click="(event) => onClickCollapse(event)">Career</h2>
        <div class="collapsible-content">
          <div class="overlay-buttons">
            <!-- TODO: add support for download -->
            <img class="button-small" title="Download as PDF" @click="onClickDownload" alt="Download" loading="lazy" src="../assets/download.png"/>
            <a target="_blank" href="https://www.linkedin.com/in/paulsandersonyup/">
              <img class="button-small" title="LinkedIn" alt="LinkedIn" loading="lazy" src="../assets/linkedin.png"/>
            </a>
          </div>
          <h3>Education</h3>
          <h4 class="align-left no-wrap">Bachelor of Science in Computer Science</h4>
          <h4 class="align-left no-wrap">Professional Option with Honors</h4>
          <div class="flex-container flex-row flex-wrap">
            <h5 class="flex-dynamic align-left no-wrap">Montana State University</h5>
            <h5 class="flex-static no-wrap">09/2007–12/2011</h5>
          </div>
          <h3>Skills</h3>
          <div class="flex-container flex-row flex-wrap">
            <h5 class="flex-dynamic skill-tile">C# and .NET</h5>
            <h5 class="flex-dynamic skill-tile">Java and Android</h5>
            <h5 class="flex-dynamic skill-tile">Python</h5>
            <h5 class="flex-dynamic skill-tile">API Development</h5>
            <h5 class="flex-dynamic skill-tile">Cloud Administration</h5>
            <h5 class="flex-dynamic skill-tile">Load Balancing</h5>
            <h5 class="flex-dynamic skill-tile">Cache Optimization</h5>
            <h5 class="flex-dynamic skill-tile">SQL</h5>
            <h5 class="flex-dynamic skill-tile">Typescript</h5>
            <h5 class="flex-dynamic skill-tile">JavaScript</h5>
            <h5 class="flex-dynamic skill-tile">UI/UX</h5>
            <h5 class="flex-dynamic skill-tile">Accessibility</h5>
            <h5 class="flex-dynamic skill-tile">Wireframing</h5>
            <h5 class="flex-dynamic skill-tile">CI/CD</h5>
            <h5 class="flex-dynamic skill-tile">Project Management</h5>
            <h5 class="flex-dynamic skill-tile">Version Control</h5>
            <h5 class="flex-dynamic skill-tile">Workflow Design</h5>
            <h5 class="flex-dynamic skill-tile">Embedded Systems</h5>
            <h5 class="flex-dynamic skill-tile">Computer Vision</h5>
          </div>
          <h3>Experience</h3>
          <h4 class="align-left no-wrap">Senior Applications Engineer</h4>
          <div class="flex-container flex-row flex-wrap">
            <h5 class="flex-dynamic align-left no-wrap">Oracle America, Inc.</h5>
            <h5 class="flex-static no-wrap">01/2016–09/2022</h5>
          </div>
          <div class="flex-container flex-column align-left">
            <!-- TODO: copy hover/selected text-overflow effect from jokes page -->
            <div class="flex-static">◆ Designed and developed complex web controls as a full-stack developer</div>
            <div class="flex-static">◆ Focused on security; scalability, reliability, and responsiveness; accessibility, usability and reusability</div>
            <div class="flex-static">◆ Optimized asynchronous web requests, data routing, and load balancing, caching and expiration</div>
            <div class="flex-static">◆ Wrote browser automation scripts, full-stack integration tests, load tests, unit tests</div>
            <div class="flex-static">◆ Maintained and improved CI/CD pipeline and processes, built and shared productivity tools</div>
            <div class="flex-static">◆ Coordinated cross-team projects, reviewed code changes, trained new devs, managed team scrum role</div>
          </div>
          <br/>
          <h4 class="align-left no-wrap">Cloud Administrator</h4>
          <div class="flex-container flex-row flex-wrap">
            <h5 class="flex-dynamic align-left no-wrap">United States Geological Survey</h5>
            <h5 class="flex-static no-wrap">08/2015–01/2016</h5>
          </div>
          <div class="flex-container flex-column align-left">
            <div class="flex-static">◆ Implemented Virtual Private Clouds on AWS for internal sites across the USGS</div>
            <div class="flex-static">◆ Automated AWS management tools with bash and Python scripts</div>
            <div class="flex-static">◆ Developed JSON library for generating custom Virtual Private Clouds using CloudFormation</div>
            <div class="flex-static">◆ Managed AWS assets like EC2, S3, ELB, EBS, SNS</div>
            <div class="flex-static">◆ Defined intake process for user data</div>
            <div class="flex-static">◆ Met requirements for a wide range of stakeholders in a fast-paced, agile strategy</div>
          </div>
          <br/>
          <h4 class="align-left no-wrap">Software Developer</h4>
          <div class="flex-container flex-row flex-wrap">
            <h5 class="flex-dynamic align-left no-wrap">Computers Unlimited</h5>
            <h5 class="flex-static no-wrap">01/2012–08/2015</h5>
          </div>
          <div class="flex-container flex-column align-left">
            <div class="flex-static">◆ Worked closely with QA team members to develop and refine new features</div>
            <div class="flex-static">◆ Provided custom code and data hot-fixes to customers with rapid turn-around</div>
            <div class="flex-static">◆ Mentored developers through code reviews, pairing, and brainstorming</div>
            <div class="flex-static">◆ Provided detailed designs, estimates, and reviews for major projects</div>
            <div class="flex-static">◆ Drafted thorough test plans, documentation, and readmes</div>
          </div>
          <br/>
          <h4 class="align-left no-wrap">Android Application Developer</h4>
          <div class="flex-container flex-row flex-wrap">
            <h5 class="flex-dynamic align-left no-wrap">Future Farm</h5>
            <h5 class="flex-static no-wrap">05/2011–09/2011</h5>
          </div>
          <div class="flex-container flex-column align-left">
            <div class="flex-static">◆ Independently built and launched complex Android application from scratch</div>
            <div class="flex-static">◆ Optimized UI and data for efficiency and responsiveness</div>
            <div class="flex-static">◆ Designed UX to be intuitive and interesting</div>
            <div class="flex-static">◆ Collaborated with graphic designer to stylize application</div>
            <div class="flex-static">◆ Incorporated Google Ads and Google Maps with custom overlaid user interface</div>
          </div>
          <br/>
          <h4 class="align-left no-wrap">Software Tester</h4>
          <div class="flex-container flex-row flex-wrap">
            <h5 class="flex-dynamic align-left no-wrap">Naval Undersea Warfare Center</h5>
            <h5 class="flex-static no-wrap">05/2010–09/2010</h5>
          </div>
          <div class="flex-container flex-column align-left">
            <div class="flex-static">◆ Worked independently to load-test reporting web server</div>
            <div class="flex-static">◆ Wrote automation scripts to simulate realistic use-cases</div>
            <div class="flex-static">◆ Iteratively gathered data and configured server to respond better to peak demand</div>
            <div class="flex-static">◆ Confirmed updates and new features were performant and scalable</div>
          </div>
        </div>
        <h2 class="collapsible-header" @click="(event) => onClickCollapse(event)">Contact</h2>
        <!-- TODO: create contact form -->
        <p class="collapsible-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum dignissim elementum. Nunc rhoncus leo vel vehicula efficitur. Morbi venenatis orci nec euismod aliquam. Nullam lobortis nulla at justo blandit pellentesque. Suspendisse feugiat tempor nisl, nec interdum lorem blandit ut. Donec ultrices tincidunt consectetur. Aenean tellus massa, lacinia ut erat ac, ultricies finibus felis. Donec suscipit lectus eu tortor blandit, at faucibus eros dapibus.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  methods: {
    async onClickCollapse (event: MouseEvent) {
      const targetElement: HTMLElement = event.target as HTMLElement
      targetElement.nextElementSibling?.classList.toggle('active')
      targetElement.classList.toggle('active')
    },
    async onClickDownload (event: MouseEvent) {
      return false
    }
  }
})
</script>

<style scoped lang="scss">
@import "@/utilities/constants";
h3 {
  margin: 5px;
}
h4 {
  margin: 3px;
}
h5 {
  margin: 1px;
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
.overlay-buttons {
  position: absolute;
  right: 25px;
  .button-small {
    margin-right: 5px;
  }
}
.large-image {
  border-radius: 10px;
  transition: 0.5s;
  min-width: 266px;
  @media screen and (max-width: $small) {
    min-width: 100px;
    max-height: 150px;
  }
  &:hover {
    opacity: 0.5;
  }
}
.skill-tile {
  border-radius: 8px;
  padding-top: 3px;
  padding-bottom: 2px;
  margin: 3px;
  background-color: $header-footer-background-color;
}
.no-wrap {
  white-space: nowrap;
}
.align-left {
  text-align: left;
}
</style>
