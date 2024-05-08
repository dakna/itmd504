<script lang="ts">

  import { Card, CardHeader, CardBody, CardTitle, CardFooter, Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from '@sveltestrap/sveltestrap';
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import { onMount } from 'svelte';
  import axios from 'axios';

  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "https://itmd504.azurewebsites.net:3000/api";

  // based on CEEB codes
  const colleges = [
    {
      id: '4833',
      name: 'UNIVERSITY OF CALIFORNIA - BERKELEY'
    },
    {
      id: '3434',
      name: 'HARVARD UNIVERSITY'
    }
  ]

  let applications = [];
  
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
    await axios.get(`${apiEndpoint}/applications`).then( (r) => {
      // console.log(`r.data ${JSON.stringify(r.data)}`);
      applications = r.data;      
    });
  }

  async function deleteApplication(id, partitionKey) {
    await axios.delete(`${apiEndpoint}/applications/${id}/${partitionKey}`).then( () => getApplications());
  }


  function openModal(app) {
    currentApp = app;
    console.log(`openModal currentApp ${currentApp}`);
    toggleModal();
  }

  function getCollegeNameById(id) {    
    let filtered = colleges.filter( college => college.id == id );
    
    if (filtered.length == 1) return filtered[0].name
    else throw new Error(`Found more than one college for id ${id}`);
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
      <Container sm class="my-3">
        <Card>
          <CardHeader>
            <CardTitle id="title_{app.id}">{app.firstName} {app.lastName}</CardTitle>
            <Tooltip target="title_{app.id}" placement="top" delay="2000">ID: {app.id}</Tooltip>              
          </CardHeader>
        
        <CardBody>
          <Container>
            <Row class="my-2">
              <Col xs="2" class="text-start fw-bold">Name:</Col>
              <Col xs="6" class="text-start">{app.firstName} {app.lastName}</Col>
              <Col xs="4" class="text-end"><a target="new" href="{app.resumeUrl}">Download Resume</a></Col>
            </Row>
            <Row class="my-2">
              <Col xs="2" class="text-start fw-bold">College:</Col>
              <Col xs="10" class="text-start">{getCollegeNameById(app.collegeId)}</Col>
            </Row>
            <Row class="my-2">
              <Col xs="2" class="text-start fw-bold">Adress:</Col>
              <Col xs="10" class="text-start">{app.address.city}, {app.address.state}</Col>
            </Row>
            <Row class="my-2">
              <Col xs="2" class="text-start fw-bold">Motivation</Col>
              <Col xs="10" class="text-start long-text">{app.motivation}</Col>
            </Row>            
          </Container>
          <code>{JSON.stringify(app)}</code>
        </CardBody> 
        <CardFooter>
          <Button color="primary" on:click={() => openModal(app)}>Edit</Button>
          <Button color="danger" on:click={() => deleteApplication(app.id, app.partitionKey)}>Delete</Button>
        </CardFooter>       
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

  .long-text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

</style>
