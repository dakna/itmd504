<script lang="ts">

  import { 
    Card, CardHeader, CardBody, CardTitle, CardFooter, 
    Container, Row, Col, 
    Button, 
    Modal, ModalHeader, ModalBody, ModalFooter, 
    Tooltip, Badge, Icon, Popover,
    Form, FormGroup, 
    Input, 
    Dropdown, DropdownItem, DropdownMenu, DropdownToggle, 
    Progress,

  } from '@sveltestrap/sveltestrap';

  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import { onMount } from 'svelte';
  import axios from 'axios';

  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "https://itmd504-api.azurewebsites.net/api";

  // based on CEEB codes
  const colleges = [
    {
      id: '4833',
      name: 'University of California - Berkeley'
    },
    {
      id: '3434',
      name: 'Harvard University'
    }
  ];

  const states = [
    {
      code: 'CA',
      name: 'California'
    },
    {
      code: 'IL',
      name: 'Illinois'
    },  
    {
      code: 'MI',
      name: 'Michigan'
    },
    {
      code: 'WA',
      name: 'Washington'
    }  
  ];

  let stateFilter = '';

  const topScoreThreshold = 3;
  let showTopScoreOnly = false;
  const minScore = 1;
  const maxScore = 5;

  let applications = getApplications();
  
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
        lastName: '',
        address: baseAddress,  
        references: [],
        motivation: '',
        resumeUrl: '',
      };

    
  let currentApp = JSON.parse(JSON.stringify(baseApp));

  let isModalOpen = false;
  let isModalCancelled = false;
  let toggleModal = () => (isModalOpen = !isModalOpen);
  let isModalEditMode = false;
  let isModalFormValidated = false;

  onMount( async() => {
    applications = getApplications();
  })

  function reloadApplications() {
    applications = getApplications();
  }

  async function getApplications() {
    const res = await axios.get(`${apiEndpoint}/applications`);
    const data = await res.data;
    // delay to clearly show loading action to user, promise bar flickers on fast networks.
    await new Promise(resolve => setTimeout(resolve, 500));
    return data;
  }

  async function deleteApplication(id, partitionKey) {
    await axios.delete(`${apiEndpoint}/applications/${id}/${partitionKey}`)
    .then( () => reloadApplications());
  }

  async function updateApplication(app) {
    console.log(`updateApplication app ${JSON.stringify(app)}`);
    await axios.put(`${apiEndpoint}/applications/${app.id}/${app.partitionKey}`, app)
    .then( () => reloadApplications())
    .then( () => resetModal());
  }

  async function addApplication(app) {
    console.log(`addApplication app ${JSON.stringify(app)}`);
    await axios.post(`${apiEndpoint}/applications`, app)
    .then( () => reloadApplications())
    .then( () => resetModal());
  }

  function openEditModal(app) {
    currentApp = JSON.parse(JSON.stringify(app));
    //console.log(`openModal currentApp ${JSON.stringify(currentApp)}`);
    isModalEditMode = true;
    toggleModal();
  }

  function openNewModal() {
    currentApp = JSON.parse(JSON.stringify(baseApp));
    //console.log(`openModal currentApp ${JSON.stringify(currentApp)}`);
    isModalEditMode = false;
    toggleModal();
  }
  function resetModal() {
    isModalCancelled = false;
    isModalEditMode = false;
    isModalOpen = false;
    isModalFormValidated = false;
  }

  function handleModalFormSubmit(e) {
    e.preventDefault();
    //console.log(`isModalEditMode ${isModalEditMode}`);
    if (isModalCancelled) {
      resetModal()
      return;
    }

    if (isModalEditMode) updateApplication(currentApp);
    else addApplication(currentApp);    
  }

  function getCollegeNameById(id) {
    let ret = '';    
    let filtered = colleges.filter( college => college.id == id );
    
    if (filtered.length == 1) ret = filtered[0].name
    else console.error(`Unable to find college for id ${id}`);
    
    return ret;
  }

  function getStateNameByCode(code) {
    let ret = '';    
    let filtered = states.filter( state => state.code == code );
    
    if (filtered.length == 1) ret = filtered[0].name
    else console.error(`Unable to find state for code ${code}`);
    
    return ret;
  }  
  
</script>

<main>
  <h3>2024 College Applications</h3>
  <div><small class="text-muted my-5">Demo SPA for itmd504 using Svelte <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" /></small></div>
  <Container sm class="mt-5">
    <Row>
      <Col class="text-start"><Input type="switch" bind:checked={showTopScoreOnly} label="Show only top scores" /></Col>
      <Col class="text-end"><Button color="primary" on:click={() => openNewModal()}>Add new application</Button></Col>
    </Row>
  </Container>
  
  

  {#await applications}
	<div class="load-info">Loading applications</div>
  <Container sm class="my-3">
    <Progress animated value={100} class="mb-2" />
  </Container>
  {:then results}

	    <div class="load-info">Loaded {results.length} applications</div>
      {#each results as app}
      {#if !showTopScoreOnly || (showTopScoreOnly && app.score >= topScoreThreshold)}
      <Container sm class="my-5">
        <Card>          
          <CardHeader>            
            <CardTitle id="title_{app.id}">{app.firstName} {app.lastName}</CardTitle>
            {#if app.score >= topScoreThreshold}
            <Badge positioned color="warning">Top Score</Badge>
            {/if}
            <Tooltip target="title_{app.id}" placement="top" delay="2000">ID: {app.id}</Tooltip>              
          </CardHeader>
        
        <CardBody>
          <Container>
            <Row class="my-2">
              <Col xs="2" class="text-start fw-bold">Name</Col>
              <Col xs="6" class="text-start">{app.firstName} {app.lastName}</Col>
              <Col xs="2" class="text-start fw-bold">Score 
                <Icon id="score-icon-{app.id}" class="text-info mx-1" name="info-circle"/>
                <Popover target="score-icon-{app.id}" trigger='hover' placement="bottom" title="Range Info">
                  Scores have a range of {minScore} to {maxScore}.
                </Popover>
              </Col>
              <Col xs="2" class="text-start">{app.score}</Col>
              <Col xs="1" class="text-end"></Col>
            </Row>
            <Row class="my-2">
              <Col xs="2" class="text-start fw-bold">Adress</Col>
              <Col xs="6" class="text-start">{app.address.city}, {getStateNameByCode(app.address.state)}</Col>
              <Col xs="2" class="text-start fw-bold">Resume</Col>
              <Col xs="2" class="text-start"><a target="new" href="{app.resumeUrl}">Download</a></Col>

            </Row>
            <Row class="my-2">
              <Col xs="2" class="text-start fw-bold">College</Col>
              <Col xs="10" class="text-start">{getCollegeNameById(app.collegeId)}</Col>
            </Row>
            <Row class="my-2">
              <Col xs="2" class="text-start fw-bold">Motivation</Col>
              <Col xs="10" class="text-start long-text">{app.motivation}</Col>
            </Row>            
          </Container>
          <!-- <code>{JSON.stringify(app)}</code> -->
        </CardBody> 
        <CardFooter>
          <Button color="primary" on:click={() => openEditModal(app)}>Edit</Button>
          <Button color="danger" on:click={() => deleteApplication(app.id, app.partitionKey)}>Delete</Button>
        </CardFooter>       
        </Card>
      </Container>
      {/if}
      {/each}
  
      {:catch error}
	<p>An error occurred: {error}</p>
  {/await}

  <Modal size="lg" isOpen={isModalOpen} toggle={toggleModal}>
    <Form validated={isModalFormValidated} on:submit={(e) => handleModalFormSubmit(e)}>
    <ModalHeader>
      {#if isModalEditMode }
      Edit
      {:else}
      Add new
      {/if}
      application: {currentApp.firstName} {currentApp.lastName}
    </ModalHeader>    
    <ModalBody>
    
      <Row>
        <Col>      
          <FormGroup floating>
          <Input placeholder="Enter a value" bind:value={currentApp.firstName} feedback="This requires a value" required/><div slot="label">First Name</div>
          </FormGroup>
        </Col>      
        <Col>
          <FormGroup floating>
          <Input placeholder="Enter a value" bind:value={currentApp.lastName} feedback="This requires a value" required/><div slot="label">Last Name</div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>      
          <FormGroup floating>
          <Input placeholder="Enter a value" bind:value={currentApp.address.city} feedback="This requires a value" required/><div slot="label">City</div>
          </FormGroup>
        </Col>      
        <Col>
          <FormGroup floating>
            <Input type="select" bind:value={currentApp.address.state} feedback="This requires a value" required>
              {#each states as state}
              <option value="{state.code}">{state.name}</option>  
              {/each}
            </Input>
          <div slot="label">State</div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>      
          <FormGroup floating>
          <Input type="select" bind:value={currentApp.collegeId} feedback="This requires a value" required>
            {#each colleges as college}
            <option value="{college.id}">{college.name}</option>  
            {/each}
          </Input>
          <div slot="label">College</div>
          </FormGroup>
        </Col>
      </Row>       
      <Row>
        <Col>      
          <FormGroup floating>
          <Input style="height: 5em" rows={5} type="textarea" placeholder="Enter a value" bind:value={currentApp.motivation} feedback="This requires a value" required/><div slot="label">Motivation</div>
          </FormGroup>
        </Col>
      </Row>            
    </ModalBody>
    <ModalFooter>
      {#if isModalEditMode }
      <Button type="submit" color="primary" on:click={() => isModalFormValidated = true}>Update</Button>  
      {:else}
      <Button type="submit" color="primary" on:click={() => isModalFormValidated = true}>Add</Button>  
      {/if}
      <Button on:click={() => isModalCancelled = true}>Cancel</Button>
    </ModalFooter>
  </Form>  
  </Modal>

</main>

<style>
  .logo {
    height: 1.5em;
    padding: 0.1em;
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
