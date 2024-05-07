<script lang="ts">

  import { Card, CardHeader, CardBody, CardTitle, Container, Row, Col, Button } from '@sveltestrap/sveltestrap';
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import { onMount } from 'svelte';
  import axios from 'axios';

  let applications = [];
  let baseurl = 'http://localhost:3000/api';

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
	<p>...waiting for applications</p>
  {:then applications}

	    <p>Loaded {applications.length} applications</p>
      {#each applications as app}
      <Container fluid>
        <Card>
          <CardHeader>
            <CardTitle>{app.firstName} {app.lastName}</CardTitle>
            <Button on:click={() => deleteApplication(app.id, app.partitionKey)}>Delete</Button>
          </CardHeader>
        
        <CardBody><code>{JSON.stringify(app)}</code></CardBody>        
        </Card>
      </Container>
      {/each}
  
      {:catch error}
	<p>An error occurred: {error}</p>
  {/await}


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
  .read-the-docs {
    color: #888;
  }
</style>
