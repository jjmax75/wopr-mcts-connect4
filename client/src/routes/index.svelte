<script>
	import { onMount } from 'svelte';
	let socket;
	let player;
	let winner;
	let validPlays;

	let board =  Array.from(Array(7), () => new Array(6));

	onMount(() => {
		socket = new WebSocket('ws://127.0.0.1:8080');

		socket.onopen = () => {
			console.log('the websocket is open');
			socket.send('begin');
		};

		socket.onmessage = ({ data }) => {
			const json = JSON.parse(data);
			console.log(json);

			winner = json.winner;
			validPlays = json.validPlays;
			board = json.board;
			player = json.player;
		}
	});

	const isValid = coords => {
		return validPlays && validPlays.includes(coords);
	}

	const handleClick = ({row, col}) => {
		const play = `${row},${col}`;
		if (player !== 1 && isValid(play)) {
			let newBoard = [...board];
			newBoard[row][col] = -1;
			board = newBoard;
			player = 1;
			socket.send(play);
		}
	}
</script>

<style>

	.row {
		display: flex;
		flex-flow: row;
	}

	.square {
		border: solid 1vw #c0bed3;
		width: 10vw;
		height: 10vw;
		font-size: 5vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.square.valid {
		border-color: green;
		cursor: pointer;
	}

	.disc {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.disc.red {
		background-color: red;
	}

	.disc.yellow {
		background-color: yellow;
	}
	.modal-container {
		position: absolute;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0,0,0,0.3);
	}
	.modal {
		padding: 30px, 0;
		height: 20vh;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
	}

	button {
		width: 50%;
		margin: 30px;
		color: teal;
		text-shadow: whitesmoke;
		font-size: 2rem;
		background: blue;
		padding: 30px;
		cursor: pointer;
	}
</style>
<svelte:head>
	<title>Connect Four</title>
</svelte:head>

{#each board as row, i}
	<div class="row">
		{#each row as col, j}
			<div
				class="square"
				class:valid={validPlays && validPlays.includes(`${i},${j}`)}
				on:click={() => handleClick({ row: i, col: j })}
			>
				<div class="disc {col === 1 ? 'red' : col === -1 ? 'yellow' : ''}"></div>
			</div>
		{/each}
	</div>
{/each}

{#if winner}
	<div class="modal-container">
		<div class="modal">
			<p>
				{#if winner === -1}
					You win
				{:else}
					Computer wins
				{/if}
			</p>
			<button on:click={() => location.reload()}>
				Start again
			</button>
		</div>
	</div>
{/if}



