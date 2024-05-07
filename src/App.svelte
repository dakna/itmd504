<script lang="ts">

  import { Card, CardHeader, CardBody, CardTitle, Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@sveltestrap/sveltestrap';
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import { onMount } from 'svelte';
  import axios from 'axios';

  let applications = [];
  const baseurl = 'http://localhost:3000/api';
  const baseReference = {
        url: ''
      };
  const baseAddress = {
        state: '',
        city: '',
      };

  const baseApp = {
        id: '',
        collegeId: '',
        partitionKey: '',
        firstName: '',
        lastName: 'Smith',
        address: baseAddress,  
        references: [],
        motivation: '',
        resumeUrl: '',
      };

    
  let currentApp = baseApp;

  let isModalOpen = false;
  let toggleModal = () => (isModalOpen = !isModalOpen);

  onMount( async() => {
    getApplications();
  })

  async function getApplications() {
    await axios.get(`${baseurl}/applications`).then( (r) => {
      // console.log(`r.data ${JSON.stringify(r.data)}`);
      applications = r.data;      
    });
  }

  async function deleteApplication(id, partitionKey) {
    await axios.delete(`${baseurl}/applications/${id}/${partitionKey}`).then( () => getApplications());
  }
  function openModal(app) {
    currentApp = app;
    console.log(`openModal currentApp ${currentApp}`);
    toggleModal();
  }
  
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <Counter />
  

  {#await applications}
	<div class="load-info">...waiting for applications</div>
  {:then applications}

	    <div class="load-info">Loaded {applications.length} applications</div>
      {#each applications as app}
      <Container fluid>
        <Card>
          <CardHeader>
            <CardTitle>{app.firstName} {app.lastName}</CardTitle>
            <Button on:click={() => openModal(app)}>Edit</Button>
            <Button on:click={() => deleteApplication(app.id, app.partitionKey)}>Delete</Button>
          </CardHeader>
        
        <CardBody><code>{JSON.stringify(app)}</code></CardBody>        
        </Card>
      </Container>
      {/each}
  
      {:catch error}
	<p>An error occurred: {error}</p>
  {/await}

  <Modal body header="{currentApp.firstName} {currentApp.lastName}" isOpen={isModalOpen} toggle={toggleModal}>
    <code>{JSON.stringify(currentApp)}</code>
  </Modal>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .load-info {
    color: #888;
  }
</style>
