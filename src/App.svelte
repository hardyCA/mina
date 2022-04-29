<script>
	import { Router, Route } from "svelte-routing";
	import Cliente from "./components/Cliente.svelte";
	import Compra from "./components/Compra.svelte";
	import Login from "./components/Login.svelte";
	import Nav from "./components/Nav.svelte";
	import Navdos from "./components/Navdos.svelte";
	import Usuario from "./components/Usuario.svelte";
	import Footer from "./components/Footer.svelte";
	import Venta from "./components/Venta.svelte";
	import Buscar from "./components/Buscar.svelte";
	import Home from "./components/Home.svelte";
	import { user } from "./stores/User";
	//pedrip575@gmail.com
	console.log($user);
	import { navigate } from "svelte-routing";
	import { onMount } from "svelte";
	import Cajachica from "./components/Cajachica.svelte";
	import Onza from "./components/Onza.svelte";
	import Reporte from "./components/Reporte.svelte";
	import Recibo from "./components/Recibo.svelte";
	import Reportecompra from "./components/Reportecompra.svelte";
	import Reporteventa from "./components/Reporteventa.svelte";
	import Totalcompra from "./components/Totalcompra.svelte";
	import Recibodos from "./components/Recibodos.svelte";

	$: onMount(() => {
		if (localStorage.getItem("io")) {
		} else {
			navigate("/login", { replace: true });
		}
	});

	function ver() {
		if (localStorage.getItem("io")) {
			let data = JSON.parse(localStorage.getItem("io"));
			user.setUser(data);
		} else {
			//console.log("No autenticado");
		}
	}
	$: ver();
</script>

{#if $user}
	<Nav />
	<Navdos />
	<!--**********************************
Content body start
**********************************-->
	<div class="content-body">
		<!-- row -->
		<div class="container-fluid">
			<Router>
				<Route path="/"><Home /></Route>
				<Route path="/usuario"><Usuario /></Route>
				<Route path="/cliente"><Cliente /></Route>
				<Route path="/compra"><Compra /></Route>
				<Route path="/venta"><Venta /></Route>
				<Route path="/buscar"><Buscar /></Route>
				<Route path="/caja-chica"><Cajachica /></Route>
				<Route path="/onza"><Onza /></Route>
				<Route path="/totalcompra"><Totalcompra /></Route>
				<Route path="/reporte"><Reporte /></Route>
				<Route path="/recibo"><Recibo /></Route>
				<Route path="/reporte-compra"><Reportecompra /></Route>
				<Route path="/reporte-venta"><Reporteventa /></Route>
				<Route path="/recibodos"><Recibodos /></Route>
			</Router>
		</div>
	</div>
	<!--**********************************
Content body end
***********************************-->
	<!-- <Footer /> -->
{:else}
	<Router>
		<Route path="/login"><Login /></Route>
	</Router>
{/if}

s
