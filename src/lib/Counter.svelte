<script>

import { Button } from '@sveltestrap/sveltestrap';

  let count = 0
  const increment = () => {
    count += 1
  }
</script>

<Button outline color="primary" on:click={increment}>
  count is {count}
</Button>
